/* ============================================================
   shell.js — Вэб дээр ажилладаг виртуал Kali терминалын цөм
   Виртуал файлын систем + командын тайлбарлагч.
   Хичээлүүдэд заасан бүх командыг (ойролцоогоор) ажиллуулна.

   Энэ бол ЖИНХЭНЭ систем биш — зөвхөн сурах зорилгоор хийсэн
   симуляц. Бодит файлд хүрэхгүй, бүх зүйл санах ойд л байна.
   ============================================================ */

import { CHALLENGES } from './challenges.js';

const NOW = 'Jun 30 14:00';

/* ---------- filesystem helpers ---------- */
function dir(perms = 'rwxr-xr-x', children = {}) {
  return { type: 'dir', perms, owner: 'kali', group: 'kali', mtime: NOW, children };
}
function file(content = '', perms = 'rw-r--r--', owner = 'kali') {
  return { type: 'file', perms, owner, group: owner, mtime: NOW, content };
}

function buildFs() {
  return dir('rwxr-xr-x', {
    home: dir('rwxr-xr-x', {
      kali: dir('rwxr-xr-x', {
        Desktop: dir(),
        Documents: dir('rwxr-xr-x', {
          'temdeglel.txt': file('Анхны тэмдэглэл.\nLinux сурч байна.\nTODO: командуудаа давтах\n'),
        }),
        Downloads: dir(),
        Pictures: dir(),
        '.bashrc': file('# ~/.bashrc\nalias ll="ls -la"\n'),
        'notes.txt': file('username: kali\npassword: changeme123\nTODO: нууц үгээ солих\n'),
      }),
    }),
    etc: dir('rwxr-xr-x', {
      hostname: file('kali\n'),
      hosts: file('127.0.0.1\tlocalhost\n127.0.1.1\tkali\n'),
      passwd: file(
        'root:x:0:0:root:/root:/usr/bin/zsh\n' +
          'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n' +
          'bin:x:2:2:bin:/bin:/usr/sbin/nologin\n' +
          'sys:x:3:3:sys:/dev:/usr/sbin/nologin\n' +
          'kali:x:1000:1000:Kali,,,:/home/kali:/usr/bin/zsh\n'
      ),
    }),
    usr: dir('rwxr-xr-x', { bin: dir(), share: dir() }),
    var: dir('rwxr-xr-x', { log: dir() }),
    tmp: dir('rwxrwxrwx'),
    root: dir('rwx------', {}, ),
  });
}

export function createShell() {
  return {
    user: 'kali',
    host: 'kali',
    fs: buildFs(),
    cwd: ['home', 'kali'],
    oldcwd: ['home', 'kali'],
    history: [],
    challenge: null,
  };
}

/* ---------- path resolution ---------- */
function normalize(shell, p) {
  let segs;
  if (p.startsWith('/')) {
    segs = [];
  } else if (p === '~' || p.startsWith('~/')) {
    segs = ['home', shell.user];
    p = p.slice(1);
  } else {
    segs = [...shell.cwd];
  }
  for (const part of p.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') segs.pop();
    else segs.push(part);
  }
  return segs;
}

function nodeAt(shell, segs) {
  let node = shell.fs;
  for (const s of segs) {
    if (node.type !== 'dir' || !node.children[s]) return null;
    node = node.children[s];
  }
  return node;
}

function parentOf(shell, segs) {
  return nodeAt(shell, segs.slice(0, -1));
}

function pathStr(segs) {
  return '/' + segs.join('/');
}

export function cwdLabel(shell) {
  const home = ['home', shell.user];
  if (arrEq(shell.cwd, home)) return '~';
  if (shell.cwd.length >= 2 && shell.cwd[0] === 'home' && shell.cwd[1] === shell.user) {
    return '~/' + shell.cwd.slice(2).join('/');
  }
  return shell.cwd.length ? pathStr(shell.cwd) : '/';
}

function arrEq(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/* ---------- tokenizer (respects single/double quotes) ---------- */
function tokenize(line) {
  const tokens = [];
  let cur = '';
  let q = null;
  let had = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === q) q = null;
      else cur += c;
    } else if (c === '"' || c === "'") {
      q = c;
      had = true;
    } else if (c === ' ' || c === '\t') {
      if (cur || had) {
        tokens.push(cur);
        cur = '';
        had = false;
      }
    } else cur += c;
  }
  if (cur || had) tokens.push(cur);
  return tokens;
}

/* split a line on top-level pipes (ignoring quoted '|') */
function splitPipes(line) {
  const parts = [];
  let cur = '';
  let q = null;
  for (const c of line) {
    if (q) {
      cur += c;
      if (c === q) q = null;
    } else if (c === '"' || c === "'") {
      q = c;
      cur += c;
    } else if (c === '|') {
      parts.push(cur);
      cur = '';
    } else cur += c;
  }
  parts.push(cur);
  return parts;
}

/* ---------- glob match (only * supported) ---------- */
function globMatch(pattern, name) {
  const re = new RegExp(
    '^' +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.') +
      '$'
  );
  return re.test(name);
}

/* ---------- long-listing (ls -l) formatting ---------- */
function typeChar(node) {
  return node.type === 'dir' ? 'd' : '-';
}
function sizeOf(node) {
  return node.type === 'dir' ? 4096 : node.content.length;
}
function longLine(name, node) {
  const links = node.type === 'dir' ? 2 : 1;
  const size = String(sizeOf(node)).padStart(5, ' ');
  return `${typeChar(node)}${node.perms} ${links} ${node.owner} ${node.group} ${size} ${node.mtime} ${name}`;
}

/* ---------- command implementations ----------
   Each: (args, shell, stdin) => string  (output, '' = nothing)
   May throw { msg } for an error line, or mutate shell. */

const ERR = (msg) => {
  const e = new Error(msg);
  e.isShell = true;
  return e;
};

const COMMANDS = {
  help() {
    return [
      'Боломжтой командууд (хичээлүүдэд заасан):',
      '',
      '  Файлын систем : pwd  ls  cd  tree',
      '  Файл удирдах  : mkdir  touch  cp  mv  rm',
      '  Унших/бичих   : cat  less  head  tail  nano  vim  echo',
      '  Эрх           : chmod  chown  sudo  whoami  id',
      '  Багц          : apt',
      '  Сүлжээ        : ip  ifconfig  ping  nslookup',
      '  Процесс       : ps  top  kill',
      '  Хайлт         : find  grep  locate',
      '  Програмчлал   : python3',
      '  Kali хэрэгсэл  : nmap  msfconsole  tshark  john  hashcat  md5sum',
      '  Веб/халдлага  : sqlmap  hydra  gobuster  nikto',
      '  Бусад         : man  clear  history  hostname  date  help',
      '',
      "Жишээ:  ls -la   ·   cd Documents   ·   cat /etc/hostname   ·   ip a | grep inet",
    ].join('\n');
  },

  clear() {
    return { clear: true };
  },

  whoami(args, shell) {
    return shell.user;
  },

  id(args, shell) {
    return `uid=1000(${shell.user}) gid=1000(${shell.user}) groups=1000(${shell.user}),27(sudo)`;
  },

  hostname(args, shell) {
    return shell.host;
  },

  date() {
    return 'Tue Jun 30 14:00:00 +08 2026';
  },

  echo(args) {
    const a = args[0] === '-n' ? args.slice(1) : args;
    return a.join(' ');
  },

  pwd(args, shell) {
    return shell.cwd.length ? pathStr(shell.cwd) : '/';
  },

  ls(args, shell) {
    const flags = args.filter((a) => a.startsWith('-')).join('');
    const targets = args.filter((a) => !a.startsWith('-'));
    const showAll = flags.includes('a');
    const long = flags.includes('l');
    const path = targets[0] || '.';
    const segs = normalize(shell, path);
    const node = nodeAt(shell, segs);
    if (!node) throw ERR(`ls: cannot access '${path}': No such file or directory`);

    if (node.type === 'file') {
      return long ? longLine(path, node) : path;
    }

    let names = Object.keys(node.children).sort((a, b) =>
      a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''))
    );
    if (showAll) names = ['.', '..', ...names];
    else names = names.filter((n) => !n.startsWith('.'));

    if (!long) return names.join('  ');

    const lines = [`total ${names.length * 4}`];
    for (const n of names) {
      let child;
      if (n === '.') child = node;
      else if (n === '..') child = parentOf(shell, segs) || node;
      else child = node.children[n];
      lines.push(longLine(n, child));
    }
    return lines.join('\n');
  },

  cd(args, shell) {
    const target = args[0];
    let segs;
    if (!target || target === '~') segs = ['home', shell.user];
    else if (target === '-') segs = [...shell.oldcwd];
    else segs = normalize(shell, target);

    const node = nodeAt(shell, segs);
    if (!node) throw ERR(`cd: ${target}: No such file or directory`);
    if (node.type !== 'dir') throw ERR(`cd: ${target}: Not a directory`);
    shell.oldcwd = [...shell.cwd];
    shell.cwd = segs;
    return target === '-' ? (shell.cwd.length ? pathStr(shell.cwd) : '/') : '';
  },

  mkdir(args, shell) {
    const names = args.filter((a) => !a.startsWith('-'));
    if (!names.length) throw ERR('mkdir: missing operand');
    for (const name of names) {
      const segs = normalize(shell, name);
      const parent = parentOf(shell, segs);
      const base = segs[segs.length - 1];
      if (!parent || parent.type !== 'dir')
        throw ERR(`mkdir: cannot create directory '${name}': No such file or directory`);
      if (parent.children[base])
        throw ERR(`mkdir: cannot create directory '${name}': File exists`);
      parent.children[base] = dir();
    }
    return '';
  },

  touch(args, shell) {
    if (!args.length) throw ERR('touch: missing file operand');
    for (const name of args) {
      const segs = normalize(shell, name);
      const parent = parentOf(shell, segs);
      const base = segs[segs.length - 1];
      if (!parent || parent.type !== 'dir')
        throw ERR(`touch: cannot touch '${name}': No such file or directory`);
      if (!parent.children[base]) parent.children[base] = file('');
    }
    return '';
  },

  cat(args, shell, stdin) {
    const files = args.filter((a) => !a.startsWith('-'));
    if (!files.length) return stdin ?? '';
    let out = '';
    for (const f of files) {
      const node = nodeAt(shell, normalize(shell, f));
      if (!node) throw ERR(`cat: ${f}: No such file or directory`);
      if (node.type === 'dir') throw ERR(`cat: ${f}: Is a directory`);
      out += node.content;
    }
    return out.replace(/\n$/, '');
  },

  less(args, shell, stdin) {
    return COMMANDS.cat(args, shell, stdin);
  },

  head(args, shell, stdin) {
    let n = 10;
    const rest = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n') n = parseInt(args[++i], 10) || 10;
      else if (/^-\d+$/.test(args[i])) n = parseInt(args[i].slice(1), 10);
      else rest.push(args[i]);
    }
    const content = rest.length
      ? COMMANDS.cat(rest, shell)
      : (stdin ?? '');
    return content.split('\n').slice(0, n).join('\n');
  },

  tail(args, shell, stdin) {
    let n = 10;
    const rest = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n') n = parseInt(args[++i], 10) || 10;
      else if (/^-\d+$/.test(args[i])) n = parseInt(args[i].slice(1), 10);
      else rest.push(args[i]);
    }
    const content = rest.length ? COMMANDS.cat(rest, shell) : (stdin ?? '');
    const lines = content.split('\n');
    return lines.slice(Math.max(0, lines.length - n)).join('\n');
  },

  nano(args) {
    const f = args.find((a) => !a.startsWith('-')) || 'файл';
    return [
      `nano: энэ виртуал терминалд интерактив засварлагч ажиллахгүй.`,
      `Файл руу бичихийн тулд дахин чиглүүлэлт ашиглаарай:`,
      `  echo "миний текст" > ${f}`,
      `  echo "нэмэлт мөр" >> ${f}`,
    ].join('\n');
  },

  cp(args, shell) {
    const ps = args.filter((a) => !a.startsWith('-'));
    if (ps.length < 2) throw ERR('cp: missing destination file operand');
    const src = nodeAt(shell, normalize(shell, ps[0]));
    if (!src) throw ERR(`cp: cannot stat '${ps[0]}': No such file or directory`);
    const recursive = args.some((a) => a.startsWith('-') && a.includes('r'));
    if (src.type === 'dir' && !recursive)
      throw ERR(`cp: -r not specified; omitting directory '${ps[0]}'`);
    placeInto(shell, ps[1], baseName(ps[0]), clone(src));
    return '';
  },

  mv(args, shell) {
    const ps = args.filter((a) => !a.startsWith('-'));
    if (ps.length < 2) throw ERR('mv: missing destination file operand');
    const srcSegs = normalize(shell, ps[0]);
    const src = nodeAt(shell, srcSegs);
    if (!src) throw ERR(`mv: cannot stat '${ps[0]}': No such file or directory`);
    placeInto(shell, ps[1], baseName(ps[0]), src);
    // remove original
    const sp = parentOf(shell, srcSegs);
    delete sp.children[srcSegs[srcSegs.length - 1]];
    return '';
  },

  rm(args, shell) {
    const recursive = args.some((a) => /^-/.test(a) && /[rR]/.test(a));
    const force = args.some((a) => /^-/.test(a) && /f/.test(a));
    const names = args.filter((a) => !a.startsWith('-'));
    if (!names.length) throw ERR('rm: missing operand');
    for (const name of names) {
      const segs = normalize(shell, name);
      const node = nodeAt(shell, segs);
      if (!node) {
        if (force) continue;
        throw ERR(`rm: cannot remove '${name}': No such file or directory`);
      }
      if (node.type === 'dir' && !recursive)
        throw ERR(`rm: cannot remove '${name}': Is a directory`);
      const parent = parentOf(shell, segs);
      delete parent.children[segs[segs.length - 1]];
    }
    return '';
  },

  chmod(args, shell) {
    const mode = args[0];
    const target = args[args.length - 1];
    if (!mode || !target || mode === target)
      throw ERR('chmod: missing operand');
    const node = nodeAt(shell, normalize(shell, target));
    if (!node) throw ERR(`chmod: cannot access '${target}': No such file or directory`);
    if (/^[0-7]{3}$/.test(mode)) node.perms = numToPerms(mode);
    else if (mode.includes('+x')) node.perms = addExec(node.perms);
    else if (mode.includes('-x')) node.perms = node.perms.replace(/x/g, '-');
    return '';
  },

  chown(args, shell) {
    const ps = args.filter((a) => !a.startsWith('-'));
    const spec = ps[0] || '';
    const target = ps[1];
    const node = nodeAt(shell, normalize(shell, target));
    if (!node) throw ERR(`chown: cannot access '${target}': No such file or directory`);
    const [owner, group] = spec.split(':');
    if (owner) node.owner = owner;
    node.group = group || owner || node.group;
    return '';
  },

  sudo(args, shell, stdin) {
    if (!args.length) throw ERR('usage: sudo command');
    const [cmd, ...rest] = args;
    const fn = COMMANDS[cmd];
    if (!fn) throw ERR(`sudo: ${cmd}: command not found`);
    return fn(rest, shell, stdin);
  },

  apt(args, shell) {
    const sub = args[0];
    const pkg = args.find((a, i) => i > 0 && !a.startsWith('-'));
    switch (sub) {
      case 'update':
        return [
          'Get:1 http://http.kali.org/kali kali-rolling InRelease [41.5 kB]',
          'Get:2 http://http.kali.org/kali kali-rolling/main amd64 Packages [19.8 MB]',
          'Reading package lists... Done',
          'Building dependency tree... Done',
          'All packages are up to date.',
        ].join('\n');
      case 'upgrade':
      case 'full-upgrade':
        return [
          'Reading package lists... Done',
          'Building dependency tree... Done',
          'Calculating upgrade... Done',
          '0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.',
        ].join('\n');
      case 'install':
        if (!pkg) throw ERR('E: No packages specified');
        return [
          'Reading package lists... Done',
          'Building dependency tree... Done',
          `The following NEW packages will be installed:`,
          `  ${pkg}`,
          `Setting up ${pkg} ...`,
          `${pkg} суулгагдлаа. (симуляц)`,
        ].join('\n');
      case 'remove':
      case 'purge':
        if (!pkg) throw ERR('E: No packages specified');
        return [
          'Reading package lists... Done',
          `Removing ${pkg} ...`,
          `${pkg} устгагдлаа. (симуляц)`,
        ].join('\n');
      default:
        return 'apt: ашиглах: apt [update|upgrade|install|remove] ...';
    }
  },

  ip(args) {
    const sub = args[0];
    if (sub === 'a' || sub === 'addr' || sub === 'address' || !sub) {
      return [
        '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN',
        '    inet 127.0.0.1/8 scope host lo',
        '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP',
        '    link/ether 08:00:27:1f:2a:3b brd ff:ff:ff:ff:ff:ff',
        '    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic eth0',
      ].join('\n');
    }
    return '';
  },

  ifconfig() {
    return [
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
      '        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255',
      '        ether 08:00:27:1f:2a:3b  txqueuelen 1000  (Ethernet)',
      '',
      'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
      '        inet 127.0.0.1  netmask 255.0.0.0',
    ].join('\n');
  },

  ping(args) {
    let n = 4;
    const rest = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-c') n = parseInt(args[++i], 10) || 4;
      else if (!args[i].startsWith('-')) rest.push(args[i]);
    }
    const host = rest[0];
    if (!host) throw ERR('ping: usage error: Destination address required');
    const lines = [`PING ${host} (${host}) 56(84) bytes of data.`];
    for (let i = 1; i <= n; i++) {
      const t = (10 + Math.random() * 8).toFixed(1);
      lines.push(`64 bytes from ${host}: icmp_seq=${i} ttl=117 time=${t} ms`);
    }
    lines.push('', `--- ${host} ping statistics ---`);
    lines.push(
      `${n} packets transmitted, ${n} received, 0% packet loss, time ${n * 1000}ms`
    );
    return lines.join('\n');
  },

  nslookup(args) {
    const host = args[0] || 'example.com';
    return [
      'Server:\t\t192.168.1.1',
      'Address:\t192.168.1.1#53',
      '',
      'Non-authoritative answer:',
      `Name:\t${host}`,
      'Address: 93.184.216.34',
    ].join('\n');
  },

  ps(args) {
    return [
      'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
      'root           1  0.0  0.1 167684 11200 ?        Ss   14:00   0:01 /sbin/init',
      'root         420  0.0  0.2 240100 18300 ?        Ss   14:00   0:00 /usr/sbin/sshd',
      'kali        1024  0.0  0.3 720500 28800 pts/0    Ss   14:01   0:00 zsh',
      'kali        1337  0.5  0.4 810200 41000 pts/0    R+   14:05   0:00 ps aux',
    ].join('\n');
  },

  top() {
    return [
      'top - 14:05:01 up 5 min,  1 user,  load average: 0.04, 0.10, 0.08',
      'Tasks:  98 total,   1 running,  97 sleeping,   0 stopped,   0 zombie',
      '%Cpu(s):  1.3 us,  0.7 sy,  0.0 ni, 97.8 id,  0.2 wa',
      'MiB Mem :   3936.0 total,   2480.5 free,    820.2 used,    635.3 buff/cache',
      '',
      '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
      ' 1024 kali      20   0  720500  28800  20100 S   0.7   0.7   0:00.45 zsh',
      ' 1337 kali      20   0  810200  41000  30200 R   0.5   1.0   0:00.10 top',
      '',
      '(жинхэнэ top-д q дарж гарна. Энд зөвхөн агшин зурагтай.)',
    ].join('\n');
  },

  kill(args) {
    const pid = args.filter((a) => !a.startsWith('-')).pop();
    if (!pid) throw ERR('kill: usage: kill [-signal] pid');
    if (!/^\d+$/.test(pid)) throw ERR(`kill: ${pid}: arguments must be process IDs`);
    return ''; // success is silent
  },

  find(args, shell) {
    const start = args[0] && !args[0].startsWith('-') ? args[0] : '.';
    let namePat = null;
    const ni = args.indexOf('-name');
    if (ni !== -1) namePat = args[ni + 1];
    const segs = normalize(shell, start);
    const node = nodeAt(shell, segs);
    if (!node) throw ERR(`find: '${start}': No such file or directory`);
    const out = [];
    walk(node, start === '/' ? '' : start.replace(/\/$/, ''), (full, name) => {
      if (!namePat || globMatch(namePat, name)) out.push(full);
    });
    return out.join('\n');
  },

  grep(args, shell, stdin) {
    const recursive = args.some((a) => /^-.*r/.test(a));
    const ignore = args.some((a) => /^-.*i/.test(a));
    const ps = args.filter((a) => !a.startsWith('-'));
    const pattern = ps[0];
    if (pattern == null) throw ERR('usage: grep [-ri] PATTERN [FILE...]');
    const targets = ps.slice(1);
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ignore ? 'i' : '');
    const matchLines = (text, prefix = '') =>
      text
        .split('\n')
        .filter((l) => re.test(l))
        .map((l) => (prefix ? `${prefix}:${l}` : l));

    if (!targets.length) {
      return matchLines(stdin ?? '').join('\n');
    }

    const out = [];
    for (const t of targets) {
      const segs = normalize(shell, t);
      const node = nodeAt(shell, segs);
      if (!node) {
        out.push(`grep: ${t}: No such file or directory`);
        continue;
      }
      if (node.type === 'dir') {
        if (!recursive) {
          out.push(`grep: ${t}: Is a directory`);
          continue;
        }
        walk(node, t === '/' ? '' : t.replace(/\/$/, ''), (full, name, n) => {
          if (n.type === 'file') out.push(...matchLines(n.content, full));
        });
      } else {
        const prefix = targets.length > 1 || recursive ? t : '';
        out.push(...matchLines(node.content, prefix));
      }
    }
    return out.join('\n');
  },

  locate(args, shell) {
    const term = args[0] || '';
    const out = [];
    walk(shell.fs, '', (full, name) => {
      if (full.includes(term)) out.push(full);
    });
    return out.join('\n');
  },

  nmap(args, shell) {
    // --- parse arguments ---
    let portSpec = null;
    let outFile = null;
    const flags = {};
    const targets = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-p') portSpec = args[++i];
      else if (a.startsWith('-p') && a.length > 2) portSpec = a.slice(2);
      else if (a === '-oN' || a === '-oX' || a === '-oG' || a === '-oA') outFile = args[++i];
      else if (a === '--version' || a === '-V') flags.version = true;
      else if (a.startsWith('--script')) flags.script = a.includes('=') ? a.split('=')[1] : 'default';
      else if (a.startsWith('-T')) flags.timing = a;
      else if (a.startsWith('-')) flags[a.replace(/^-+/, '')] = true;
      else targets.push(a);
    }

    if (flags.version) {
      return 'Nmap version 7.94 ( https://nmap.org )\nPlatform: x86_64-pc-linux-gnu';
    }

    const target = targets[targets.length - 1] || '192.168.1.105';

    const SERVICES = {
      21: ['ftp', 'vsftpd 3.0.5'],
      22: ['ssh', 'OpenSSH 9.2p1 Debian'],
      23: ['telnet', 'Linux telnetd'],
      25: ['smtp', 'Postfix smtpd'],
      53: ['domain', 'ISC BIND 9.18'],
      80: ['http', 'Apache httpd 2.4.57'],
      110: ['pop3', 'Dovecot pop3d'],
      139: ['netbios-ssn', 'Samba smbd 4'],
      143: ['imap', 'Dovecot imapd'],
      443: ['https', 'Apache httpd 2.4.57 (SSL)'],
      445: ['microsoft-ds', 'Samba smbd 4'],
      3306: ['mysql', 'MySQL 8.0.34'],
      3389: ['ms-wbt-server', 'xrdp'],
      8080: ['http-proxy', 'Apache httpd 2.4.57'],
    };
    const DEFAULT_OPEN = [22, 80, 443];

    const header = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-06-30 16:00 +08`;
    const lines = [header];

    // --- host discovery only ---
    if (flags.sn) {
      lines.push(
        'Nmap scan report for 192.168.1.1',
        'Host is up (0.0021s latency).',
        'Nmap scan report for 192.168.1.105',
        'Host is up (0.00040s latency).',
        'Nmap scan report for 192.168.1.110',
        'Host is up (0.012s latency).',
        'Nmap done: 256 IP addresses (3 hosts up) scanned in 2.34 seconds'
      );
      return finishNmap(lines, outFile, shell);
    }

    lines.push(`Nmap scan report for ${target}`);
    lines.push('Host is up (0.0015s latency).');

    // --- decide which ports to display ---
    let ports;
    if (portSpec === '-' || flags['p-']) {
      ports = [21, 22, 25, 80, 110, 139, 443, 445, 3306, 8080];
      lines.push('Not shown: 65525 closed tcp ports (conn-refused)');
    } else if (portSpec) {
      ports = [];
      for (const part of portSpec.split(',')) {
        if (part.includes('-')) {
          const [lo, hi] = part.split('-').map((n) => parseInt(n, 10));
          for (let p = lo; p <= hi && ports.length < 50; p++) ports.push(p);
        } else ports.push(parseInt(part, 10));
      }
    } else {
      ports = DEFAULT_OPEN.slice();
      lines.push('Not shown: 997 closed tcp ports (conn-refused)');
    }

    const showVersion = flags.sV || flags.A;
    lines.push(showVersion ? 'PORT     STATE SERVICE       VERSION' : 'PORT     STATE SERVICE');

    for (const p of ports) {
      const svc = SERVICES[p];
      const isOpen = svc && (portSpec || DEFAULT_OPEN.includes(p) || flags['p-']);
      const state = isOpen ? 'open' : 'closed';
      const name = svc ? svc[0] : 'unknown';
      const portCol = `${p}/tcp`.padEnd(8, ' ');
      const stateCol = state.padEnd(5, ' ');
      if (showVersion) {
        const nameCol = name.padEnd(13, ' ');
        const ver = isOpen ? svc[1] : '';
        lines.push(`${portCol} ${stateCol} ${nameCol} ${ver}`.trimEnd());
      } else {
        lines.push(`${portCol} ${stateCol} ${name}`);
      }
    }

    // --- NSE script output ---
    if (flags.sC || flags.A || flags.script) {
      const which = flags.script && flags.script !== 'default' ? flags.script : 'http-title';
      lines.push('');
      lines.push(`| ${which}:`);
      lines.push('|_  Apache2 Debian Default Page: It works');
    }

    // --- OS detection ---
    if (flags.O || flags.A) {
      lines.push('Device type: general purpose');
      lines.push('Running: Linux 5.X|6.X');
      lines.push('OS details: Linux 5.15 - 6.1');
      lines.push('Network Distance: 1 hop');
    }

    // --- traceroute (only with -A) ---
    if (flags.A) {
      lines.push('');
      lines.push('TRACEROUTE');
      lines.push('HOP RTT     ADDRESS');
      lines.push(`1   0.40 ms ${target}`);
    }

    const dur = flags.A ? '14.07' : flags.sV ? '6.52' : '1.82';
    lines.push(`Nmap done: 1 IP address (1 host up) scanned in ${dur} seconds`);
    return finishNmap(lines, outFile, shell);
  },

  msfconsole() {
    return [
      '       =[ metasploit v6.4.0-dev                          ]',
      '+ -- --=[ 2400+ exploits - 1200+ auxiliary - 410+ post   ]',
      '+ -- --=[ 1390+ payloads - 46 encoders - 11 nops         ]',
      '',
      'msf6 > (интерактив консол энэ вэб симуляцид бүрэн ажиллахгүй)',
      'Бодит Kali дээр: search / use / set / exploit командуудаар үргэлжлүүл.',
    ].join('\n');
  },

  wireshark() {
    return [
      'Wireshark бол график (GUI) хэрэгсэл — энэ вэб терминалд дэлгэц нээгдэхгүй.',
      'Командын мөрнөөс ашиглахын тулд tshark-ийг турш: жишээ нь `tshark -D`.',
    ].join('\n');
  },

  tshark(args) {
    if (args.includes('--version') || args.includes('-v'))
      return 'TShark (Wireshark) 4.2.0';
    if (args.includes('-D')) return '1. eth0\n2. lo (Loopback)\n3. any';
    const yIdx = args.indexOf('-Y');
    const filter = yIdx !== -1 ? args[yIdx + 1] : null;
    const cIdx = args.indexOf('-c');
    const count = cIdx !== -1 ? parseInt(args[cIdx + 1], 10) || 3 : 5;
    if (args.includes('-w')) {
      const f = args[args.indexOf('-w') + 1] || 'capture.pcap';
      return `Capturing on 'eth0'\n${count} packets captured → ${f}`;
    }
    const sample = [
      '1 0.000000 192.168.1.105 → 8.8.8.8 ICMP 98 Echo (ping) request',
      '2 0.012000 8.8.8.8 → 192.168.1.105 ICMP 98 Echo (ping) reply',
      '3 0.103000 192.168.1.105 → 93.184.216.34 TCP 74 49512 → 80 [SYN]',
      '4 0.150000 93.184.216.34 → 192.168.1.105 HTTP 60 HTTP/1.1 200 OK',
      '5 0.180000 192.168.1.105 → 192.168.1.1 DNS 70 Standard query A example.com',
    ];
    let out = filter
      ? sample.filter((l) => new RegExp(filter, 'i').test(l))
      : sample;
    return out.slice(0, count).join('\n') || `(${filter} шүүлтүүрт тохирох багц алга)`;
  },

  john(args, shell) {
    if (!args.length || args.includes('--help'))
      return 'John the Ripper 1.9.0\nҮндсэн: john --wordlist=<list> <hashfile>';
    if (args.includes('--show')) {
      return 'user1:password123\n\n1 password hash cracked, 0 left';
    }
    const wl = args.find((a) => a.startsWith('--wordlist'));
    return [
      'Using default input encoding: UTF-8',
      'Loaded 1 password hash (md5crypt [MD5 256/256 AVX2])',
      wl ? 'Press \'q\' or Ctrl-C to abort' : 'Proceeding with single, wordlist, incremental',
      'password123      (user1)',
      '1g 0:00:00:01 DONE — 1 password hash cracked',
      "Use the \"--show\" option to display all of the cracked passwords",
    ].join('\n');
  },

  hashcat(args) {
    if (!args.length || args.includes('--help'))
      return 'hashcat (v6.2.6)\nҮндсэн: hashcat -m <mode> -a <attack> <hashfile> <wordlist>';
    const mIdx = args.indexOf('-m');
    const mode = mIdx !== -1 ? args[mIdx + 1] : '0';
    const names = { 0: 'MD5', 100: 'SHA1', 1400: 'SHA2-256', 1000: 'NTLM' };
    return [
      `hashcat (v6.2.6) starting`,
      `Hash.Mode........: ${mode} (${names[mode] || 'Unknown'})`,
      'Status...........: Cracked',
      '482c811da5d5b4bc6d497ffa98491e38:password123',
      'Recovered........: 1/1 (100.00%) Digests',
    ].join('\n');
  },

  md5sum(args, shell, stdin) {
    const fileArg = args.find((a) => !a.startsWith('-'));
    let data;
    if (fileArg) {
      const node = nodeAt(shell, normalize(shell, fileArg));
      if (!node) throw ERR(`md5sum: ${fileArg}: No such file or directory`);
      if (node.type === 'dir') throw ERR(`md5sum: ${fileArg}: Is a directory`);
      data = node.content;
    } else {
      data = stdin ?? '';
    }
    return `${md5(data)}  ${fileArg || '-'}`;
  },

  gunzip(args) {
    const f = args.find((a) => !a.startsWith('-')) || 'file.gz';
    return `${f} задаргдлаа → ${f.replace(/\.gz$/, '')} (симуляц)`;
  },

  /* ---- Metasploit-ийн командын симуляц (msfconsole доторх) ---- */
  msfvenom(args) {
    const p = args[args.indexOf('-p') + 1] || 'payload';
    const out = args.includes('-o') ? args[args.indexOf('-o') + 1] : null;
    return [
      '[-] No platform was selected, choosing Msf::Module::Platform from the payload',
      `[*] Payload: ${p}`,
      'Payload size: 341 bytes',
      out ? `Saved as: ${out}` : '(stdout руу гаргалаа)',
    ].join('\n');
  },
  search(args) {
    return [
      'Matching Modules',
      '================',
      '   #  Name                                            Rank     Description',
      '   -  ----                                            ----     -----------',
      `   0  exploit/windows/smb/ms17_010_eternalblue        average  MS17-010 EternalBlue SMB Remote Windows`,
      '',
      `Хайлт: ${args.join(' ') || '(бүгд)'}`,
    ].join('\n');
  },
  use(args) {
    const m = args[0] || 'exploit/...';
    const short = m.split('/').pop();
    return `[*] Using configured module ${m}\nmsf6 exploit(${short}) >`;
  },
  info() {
    return ['Name: Module info', 'Rank: average', 'Provided by: metasploit', 'Description: (симуляц)'].join('\n');
  },
  show(args) {
    const w = (args[0] || '').toLowerCase();
    if (w === 'options')
      return 'Module options:\n   Name    Current Setting  Required  Description\n   ----    ---------------  --------  -----------\n   RHOSTS                   yes       Зорилтот хаяг\n   RPORT   445              yes       Зорилтот порт';
    if (w === 'payloads')
      return 'Compatible Payloads\n===================\n   windows/x64/meterpreter/reverse_tcp\n   windows/x64/shell/reverse_tcp';
    if (w === 'targets') return 'Exploit targets:\n   0  Automatic';
    return 'show: options | payloads | targets';
  },
  set(args) {
    if (args.length < 1) return 'Usage: set NAME VALUE';
    return `${args[0]} => ${args.slice(1).join(' ')}`;
  },
  setg(args) {
    if (args.length < 1) return 'Usage: setg NAME VALUE';
    return `${args[0]} => ${args.slice(1).join(' ')}`;
  },
  check() {
    return '[+] The target appears to be vulnerable.';
  },
  exploit() {
    return [
      '[*] Started reverse TCP handler on 192.168.1.105:4444',
      '[*] Sending stage (200774 bytes) to 192.168.1.110',
      '[*] Meterpreter session 1 opened (192.168.1.105:4444 -> 192.168.1.110:49512)',
    ].join('\n');
  },
  run(args, shell) {
    const a = args.join(' ');
    if (/post\/|persistence|autoroute|migrate/.test(a))
      return `[*] Running module: ${a || 'post'} ...\n[+] Module гүйцэтгэлээ.`;
    return COMMANDS.exploit();
  },
  sessions(args) {
    if (args.includes('-i')) return '[*] Starting interaction with 1...\nmeterpreter >';
    return [
      'Active sessions',
      '===============',
      '  Id  Type                     Information',
      '  --  ----                     -----------',
      '  1   meterpreter x64/windows  NT AUTHORITY\\SYSTEM @ TARGET',
    ].join('\n');
  },
  back() {
    return '';
  },

  /* ---- нэмэлт командууд ---- */
  man(args) {
    const c = args[args.length - 1];
    if (!c || c.startsWith('-')) return 'Аль командын man хэрэгтэй вэ? Жишээ: man ls';
    const t = MAN_PAGES[c];
    if (!t) return `Ямар ч man хуудас алга: ${c}`;
    return `${c.toUpperCase()}(1)\n\nNAME\n    ${c} — ${t.short}\n\nDESCRIPTION\n    ${t.long}\n\n(q-ээр гарна — энэ симуляцид шууд хэвлэв.)`;
  },
  vim(args) {
    return COMMANDS.vi(args);
  },
  vi(args) {
    const f = args.find((a) => !a.startsWith('-')) || 'файл';
    return [
      `vim/vi нь бүтэн дэлгэцийн засварлагч — энэ вэб терминалд интерактив горим ажиллахгүй.`,
      `Богино: i (insert), Esc, :w (хадгал), :q (гарах), :wq (хадгалаад гарах).`,
      `Энд файл засахын тулд:  echo "текст" > ${f}  эсвэл  nano ${f}`,
    ].join('\n');
  },
  python(args, shell, stdin) {
    return COMMANDS.python3(args, shell, stdin);
  },
  python3(args) {
    if (args.includes('--version') || args.includes('-V')) return 'Python 3.11.2';
    const ci = args.indexOf('-c');
    if (ci !== -1) return pyEval(args[ci + 1] || '');
    if (args.find((a) => a.endsWith('.py')))
      return '(.py файл ажиллуулах энэ симуляцид дэмжигдэхгүй. python3 -c "..." ашиглана уу.)';
    return 'Python 3.11.2\nInteractive REPL энэ вэб терминалд бүрэн ажиллахгүй.\nЖишээ: python3 -c "print(2+2)"';
  },
  sqlmap(args) {
    const u = args[args.indexOf('-u') + 1] || 'http://target/page?id=1';
    const lines = [
      '        ___',
      "       __H__   sqlmap/1.8",
      `[*] starting @ 20:00:00`,
      `[*] testing connection to the target URL`,
      `[*] testing if the target URL content is stable`,
      `[*] testing for SQL injection on GET parameter 'id'`,
      `[+] GET parameter 'id' is 'MySQL >= 5.0 boolean-based blind' injectable`,
    ];
    if (args.includes('--dbs'))
      lines.push('available databases [3]:', '[*] information_schema', '[*] mysql', '[*] webapp');
    lines.push(`[*] target URL: ${u}`);
    return lines.join('\n');
  },
  hydra(args) {
    const svc = args.find((a) => /:\/\/|ssh|ftp|http/.test(a)) || 'ssh://192.168.1.110';
    return [
      'Hydra v9.5 (c) by van Hauser/THC',
      `[DATA] attacking ${svc}`,
      '[STATUS] 1203.00 tries/min',
      '[22][ssh] host: 192.168.1.110   login: admin   password: password123',
      '1 of 1 target successfully completed, 1 valid password found',
    ].join('\n');
  },
  gobuster(args) {
    const u = args[args.indexOf('-u') + 1] || 'http://192.168.1.110';
    return [
      '===============================================================',
      'Gobuster v3.6',
      `[+] Url:            ${u}`,
      '[+] Method:         GET',
      '===============================================================',
      '/admin                (Status: 301) [--> /admin/]',
      '/images               (Status: 301)',
      '/login                (Status: 200)',
      '/backup               (Status: 200)',
      '/robots.txt           (Status: 200)',
      '===============================================================',
    ].join('\n');
  },
  dirb(args) {
    return COMMANDS.gobuster(['-u', args[0] || 'http://192.168.1.110']);
  },
  nikto(args) {
    const h = args[args.indexOf('-h') + 1] || 'http://192.168.1.110';
    return [
      '- Nikto v2.5.0',
      `+ Target Host: ${h}`,
      '+ Server: Apache/2.4.57 (Debian)',
      '+ The anti-clickjacking X-Frame-Options header is not present.',
      '+ /admin/: Admin login page/section found.',
      '+ 7 item(s) reported',
    ].join('\n');
  },

  tree(args, shell) {
    const start = args[0] || '.';
    const node = nodeAt(shell, normalize(shell, start));
    if (!node) throw ERR(`tree: ${start}: No such file or directory`);
    const lines = [start];
    const rec = (n, prefix) => {
      if (n.type !== 'dir') return;
      const keys = Object.keys(n.children).filter((k) => !k.startsWith('.'));
      keys.forEach((k, i) => {
        const last = i === keys.length - 1;
        lines.push(prefix + (last ? '└── ' : '├── ') + k);
        rec(n.children[k], prefix + (last ? '    ' : '│   '));
      });
    };
    rec(node, '');
    return lines.join('\n');
  },

  history(args, shell) {
    return shell.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n');
  },

  soril(args, shell) {
    const sub = args[0];
    const ch = shell.challenge;

    if (sub === 'start') {
      const id = args[1];
      const def = CHALLENGES[id];
      if (!def)
        return `Сорил олдсонгүй: ${id || ''}. Боломжтой: ${Object.keys(CHALLENGES).join(', ')}`;
      if (def.setup) def.setup(shell);
      shell.challenge = { def, taskIndex: 0, active: true };
      return [
        `╔═══ ${def.title} ═══╗`,
        def.intro,
        '',
        `→ Даалгавар 1/${def.tasks.length}: ${def.tasks[0].prompt}`,
        '',
        '(Зогсоох: `soril stop` · Дахин харах: `soril`)',
      ].join('\n');
    }

    if (sub === 'stop') {
      shell.challenge = null;
      return 'Сорил зогсоолоо.';
    }

    if (!sub || sub === 'list' || sub === 'status') {
      if (ch && ch.active) {
        const t = ch.def.tasks[ch.taskIndex];
        return [
          `Идэвхтэй сорил: ${ch.def.title} (${ch.taskIndex}/${ch.def.tasks.length})`,
          `→ Одоогийн даалгавар: ${t.prompt}`,
        ].join('\n');
      }
      return [
        'Боломжтой сорилууд:',
        ...Object.values(CHALLENGES).map(
          (c) => `  soril start ${c.id}   — ${c.title}`
        ),
      ].join('\n');
    }

    return 'Ашиглах: soril [start <id> | stop | list]';
  },
};

/* ---------- support helpers used by commands ---------- */
function baseName(p) {
  const parts = p.replace(/\/$/, '').split('/');
  return parts[parts.length - 1];
}
function clone(node) {
  return JSON.parse(JSON.stringify(node));
}
function placeInto(shell, destPath, srcName, node) {
  const destSegs = normalize(shell, destPath);
  const destNode = nodeAt(shell, destSegs);
  if (destNode && destNode.type === 'dir') {
    destNode.children[srcName] = node; // copy/move into directory, keep name
  } else {
    const parent = parentOf(shell, destSegs);
    if (!parent || parent.type !== 'dir')
      throw ERR(`cannot create '${destPath}': No such file or directory`);
    parent.children[destSegs[destSegs.length - 1]] = node; // rename
  }
}
function walk(node, prefix, cb) {
  if (node.type === 'dir') {
    cb(prefix || '/', baseName(prefix) || '/', node);
    for (const [name, child] of Object.entries(node.children)) {
      walkInner(child, `${prefix}/${name}`, name, cb);
    }
  } else {
    cb(prefix, baseName(prefix), node);
  }
}
function walkInner(node, full, name, cb) {
  cb(full, name, node);
  if (node.type === 'dir') {
    for (const [cn, child] of Object.entries(node.children)) {
      walkInner(child, `${full}/${cn}`, cn, cb);
    }
  }
}
function numToPerms(num) {
  const map = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
  return num
    .split('')
    .map((d) => map[parseInt(d, 10)])
    .join('');
}
function addExec(perms) {
  // ensure owner/group/other have x where r exists (rough +x)
  return perms
    .match(/.{3}/g)
    .map((t) => t.slice(0, 2) + 'x')
    .join('');
}

/* write nmap output to a file when -oN/-oX given, then return the text */
function finishNmap(lines, outFile, shell) {
  const text = lines.join('\n');
  if (outFile) writeFile(shell, outFile, text, false);
  return text;
}

/* ---- man хуудаснууд (товч) ---- */
const MAN_PAGES = {
  ls: { short: 'жагсаах', long: 'Хавтасны агуулгыг харуулна. -l дэлгэрэнгүй, -a нуугдсан, -h хэмжээ.' },
  cd: { short: 'хавтас солих', long: 'Ажлын хавтсыг өөрчилнө. cd .. дээшээ, cd ~ гэр, cd - өмнөх.' },
  pwd: { short: 'байршил', long: 'Одоогийн ажлын хавтасны бүтэн замыг хэвлэнэ.' },
  cat: { short: 'файл хэвлэх', long: 'Файлын агуулгыг гаргана. Олон файлыг нэгтгэж болно.' },
  cp: { short: 'хуулах', long: 'Файл/хавтас хуулна. Хавтсыг -r тугтай.' },
  mv: { short: 'зөөх/нэр солих', long: 'Файлыг зөөх эсвэл нэрийг өөрчилнө.' },
  rm: { short: 'устгах', long: 'Файл устгана. Хавтсыг -r тугтай. Буцаалт байхгүй!' },
  mkdir: { short: 'хавтас үүсгэх', long: 'Шинэ хавтас үүсгэнэ. -p дунд хавтсуудыг хамт.' },
  touch: { short: 'файл үүсгэх', long: 'Хоосон файл үүсгэх эсвэл цаг шинэчлэх.' },
  grep: { short: 'текст хайх', long: 'Загвараар мөр хайна. -r рекурсив, -i үсэг үл хамаарах, -n дугаар.' },
  find: { short: 'файл хайх', long: 'Хавтсаас файл хайна. -name нэрээр, -type төрлөөр.' },
  chmod: { short: 'эрх өөрчлөх', long: 'Файлын эрхийг өөрчилнө. +x ажиллуулах, 755 тоон.' },
  chown: { short: 'эзэмшигч', long: 'Файлын эзэмшигч/группыг өөрчилнө (sudo).' },
  ps: { short: 'процесс', long: 'Ажиллаж буй процессуудыг харуулна. ps aux бүгд.' },
  kill: { short: 'процесс зогсоох', long: 'PID-ээр процесс зогсооно. -9 хатуу.' },
  nmap: { short: 'сүлжээ сканнер', long: 'Хост, порт, үйлчилгээ илрүүлнэ. -sV хувилбар, -p порт.' },
  chmod_x: { short: '', long: '' },
  echo: { short: 'текст хэвлэх', long: 'Аргументуудаа дэлгэцэнд хэвлэнэ. > файл руу чиглүүлнэ.' },
  man: { short: 'тусламж', long: 'Командын баримтжуулалтыг харуулна.' },
  apt: { short: 'багц менежер', long: 'Програм суулгах/устгах. apt update, apt install <нэр>.' },
  ssh: { short: 'алсын холболт', long: 'Шифрлэгдсэн алсын холболт. ssh user@host.' },
  sudo: { short: 'админ эрх', long: 'Командыг root эрхээр ажиллуулна. Болгоомжтой!' },
};

/* ---- python3 -c энгийн eval ---- */
function pyEval(code) {
  if (!code) return '';
  const outs = [];
  const re = /print\s*\(([\s\S]*?)\)/g;
  let m;
  while ((m = re.exec(code))) outs.push(pyExpr(m[1]));
  if (outs.length) return outs.join('\n');
  return pyExpr(code);
}
function pyExpr(e) {
  e = (e || '').trim();
  const sm = /^(['"])([\s\S]*)\1$/.exec(e);
  if (sm) return sm[2];
  if (/^[\d\s+\-*/%().]+$/.test(e)) {
    try {
      // зөвхөн арифметик тэмдэгт зөвшөөрнө
      // eslint-disable-next-line no-new-func
      return String(Function('return (' + e + ')')());
    } catch {
      return '';
    }
  }
  return e.replace(/['"]/g, '');
}

/* compact, correct MD5 (used by md5sum) — educational only */
function md5(input) {
  const bytes = [];
  for (const ch of unescape(encodeURIComponent(input))) bytes.push(ch.charCodeAt(0));

  const K = [];
  for (let i = 0; i < 64; i++)
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push((bitLen / Math.pow(2, 8 * i)) & 0xff);

  const add = (x, y) => {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  };
  const rotl = (n, c) => (n << c) | (n >>> (32 - c));

  let a0 = 0x67452301 | 0,
    b0 = 0xefcdab89 | 0,
    c0 = 0x98badcfe | 0,
    d0 = 0x10325476 | 0;

  for (let off = 0; off < bytes.length; off += 64) {
    const M = [];
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      M[i] =
        bytes[j] |
        (bytes[j + 1] << 8) |
        (bytes[j + 2] << 16) |
        (bytes[j + 3] << 24);
    }
    let A = a0,
      B = b0,
      C = c0,
      D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = add(add(F, A), add(K[i], M[g]));
      A = D;
      D = C;
      C = B;
      B = add(B, rotl(F, S[i]));
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const hexLE = (n) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const byte = (n >>> (i * 8)) & 0xff;
      s += (byte < 16 ? '0' : '') + byte.toString(16);
    }
    return s;
  };
  return hexLE(a0) + hexLE(b0) + hexLE(c0) + hexLE(d0);
}

/* ---------- the public runner ---------- */
export function runLine(shell, rawLine) {
  const line = rawLine.trim();
  if (line) shell.history.push(line);
  if (!line) return { out: '', clear: false };

  // pipeline
  const segments = splitPipes(line);
  let stdin = null;
  let lastOut = '';
  let clear = false;

  for (let s = 0; s < segments.length; s++) {
    let tokens = tokenize(segments[s].trim());
    if (!tokens.length) continue;

    // redirection (only handle on this segment's tokens)
    let redirect = null;
    const clean = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '>' || tokens[i] === '>>') {
        redirect = { append: tokens[i] === '>>', file: tokens[i + 1] };
        i++;
      } else clean.push(tokens[i]);
    }
    tokens = clean;
    if (!tokens.length) continue;

    const [name, ...args] = tokens;
    const fn = COMMANDS[name];

    let out;
    if (!fn) {
      out = `${name}: command not found`;
    } else {
      try {
        const res = fn(args, shell, stdin);
        if (res && typeof res === 'object' && res.clear) {
          clear = true;
          out = '';
        } else {
          out = res ?? '';
        }
      } catch (e) {
        out = e && e.isShell ? e.message : `${name}: error`;
      }
    }

    if (redirect && redirect.file) {
      writeFile(shell, redirect.file, out, redirect.append);
      out = '';
    }

    stdin = out; // feed to next piped command
    lastOut = out;
  }

  // --- СОРИЛ үнэлгээ: идэвхтэй сорил байвал одоогийн даалгаврыг шалгана ---
  let celebrate = false;
  let celebrateChallenge = null;
  const ev = evaluateChallenge(shell, line, lastOut);
  if (ev) {
    lastOut = (lastOut ? lastOut + '\n' : '') + ev.message;
    celebrate = ev.celebrate;
    if (ev.celebrate) celebrateChallenge = ev.challengeId || null;
    clear = false; // дэлгэц цэвэрлэх командтай давхцахаас сэргийлнэ
  }

  return { out: lastOut, clear, celebrate, celebrateChallenge };
}

/* Идэвхтэй сорилын одоогийн даалгаврыг шалгаж, биелсэн бол урагшилна.
   soril meta-командыг үнэлэхгүй. */
function evaluateChallenge(shell, line, lastOut) {
  const ch = shell.challenge;
  if (!ch || !ch.active) return null;
  const cmdName = line.split(/\s+/)[0];
  if (cmdName === 'soril') return null;

  const task = ch.def.tasks[ch.taskIndex];
  const ctx = { lastCmd: line, lastOut: lastOut || '' };
  let ok = false;
  try {
    ok = !!task.check(shell, ctx);
  } catch {
    ok = false;
  }
  if (!ok) return null;

  ch.taskIndex += 1;
  if (ch.taskIndex >= ch.def.tasks.length) {
    ch.active = false;
    return {
      celebrate: true,
      challengeId: ch.def.id,
      message: `\n✓ Зөв! Бүх ${ch.def.tasks.length} даалгавар гүйцэтгэлээ!\n🎉🎉  "${ch.def.title}" АМЖИЛТТАЙ ДУУСГАЛАА!  🎉🎉`,
    };
  }
  const next = ch.def.tasks[ch.taskIndex];
  return {
    celebrate: false,
    message: `\n✓ Зөв! (${ch.taskIndex}/${ch.def.tasks.length})\n→ Дараагийн даалгавар: ${next.prompt}`,
  };
}

function writeFile(shell, path, content, append) {
  const segs = normalize(shell, path);
  const parent = parentOf(shell, segs);
  const base = segs[segs.length - 1];
  if (!parent || parent.type !== 'dir')
    throw ERR(`cannot write '${path}': No such file or directory`);
  const text = content === '' ? '' : content.endsWith('\n') ? content : content + '\n';
  const existing = parent.children[base];
  if (append && existing && existing.type === 'file') {
    existing.content += text;
  } else {
    parent.children[base] = file(text);
  }
}

export const COMMAND_NAMES = Object.keys(COMMANDS);

export default { createShell, runLine, cwdLabel, COMMAND_NAMES };
