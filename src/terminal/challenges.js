/* ============================================================
   challenges.js — Терминал дээрх СОРИЛ (challenge)
   Түвшин бүр дуусахад өгөх дадлагын даалгавар. Хэрэглэгч
   виртуал терминал дээр бодит командаар гүйцэтгэнэ. check()
   функц файлын систем / сүүлийн команд / гаралтыг шалгаж
   зөв эсэхийг тогтооно.

   check(shell, ctx)  →  ctx = { lastCmd, lastOut }
   ============================================================ */

const MTIME = 'Jun 30 14:00';
const F = (content, perms = 'rw-r--r--') => ({
  type: 'file', perms, owner: 'kali', group: 'kali', mtime: MTIME, content,
});
const D = (children = {}) => ({
  type: 'dir', perms: 'rwxr-xr-x', owner: 'kali', group: 'kali', mtime: MTIME, children,
});

// /home/kali node
function home(shell) {
  return shell.fs.children.home.children.kali;
}
// абсолют замаар node олох (['home','kali','x'])
function node(shell, parts) {
  let n = shell.fs;
  for (const p of parts) {
    if (!n || n.type !== 'dir' || !n.children[p]) return null;
    n = n.children[p];
  }
  return n;
}
const K = (...rest) => ['home', 'kali', ...rest]; // богино зам туслах
const isDir = (s, parts) => node(s, parts)?.type === 'dir';
const isFile = (s, parts) => node(s, parts)?.type === 'file';
const content = (s, parts) => node(s, parts)?.content ?? '';
const cwdIs = (s, parts) =>
  s.cwd.length === parts.length && s.cwd.every((x, i) => x === parts[i]);

/* команд/гаралтын загвараар шалгах богино туслахууд */
const cmd = (re) => (s, ctx) => re.test(ctx.lastCmd);
const out = (re) => (s, ctx) => re.test(ctx.lastOut);
const both = (...fns) => (s, ctx) => fns.every((f) => f(s, ctx));
const T = (prompt, check) => ({ prompt, check });
// гэрийн хавтаст төлөвлөсөн файлуудыг цэвэрлэх + cwd reset
const reset = (files = []) => (shell) => {
  shell.cwd = ['home', 'kali'];
  const h = home(shell);
  for (const f of files) delete h.children[f];
};

export const CHALLENGES = {
  /* ---------------- Анхан шатны сорил ---------------- */
  anhan: {
    id: 'anhan',
    title: 'Анхан шатны сорил',
    level: 'Анхан шат',
    intro:
      'Үндсэн командуудаа турш! Доорх даалгавруудыг терминал дээр дараалан гүйцэтгэ.',
    setup(shell) {
      const h = home(shell);
      shell.cwd = ['home', 'kali'];
      h.children['.daalgavar.txt'] = F('Нэг нууц байна: 42\n');
      if (!h.children.Documents) h.children.Documents = D();
      h.children.Documents.children['temdeglel.txt'] = F('энэ файлыг устгана\n');
      delete h.children.mission;
    },
    tasks: [
      {
        prompt: '/home/kali дотор `mission` нэртэй хавтас үүсгэ.',
        hint: 'mkdir mission',
        check: (s) => isDir(s, K('mission')),
      },
      {
        prompt: '`mission` хавтас дотор `tailan.txt` файл үүсгэ.',
        hint: 'touch mission/tailan.txt',
        check: (s) => isFile(s, K('mission', 'tailan.txt')),
      },
      {
        prompt: '`mission/tailan.txt` дотор `kali` гэсэн үг бич.',
        hint: 'echo "kali" > mission/tailan.txt',
        check: (s) => /kali/i.test(content(s, K('mission', 'tailan.txt'))),
      },
      {
        prompt:
          'Гэрийн хавтсанд нуугдсан `.daalgavar.txt` файлыг олж уншаарай.',
        hint: 'ls -a   дараа нь   cat .daalgavar.txt',
        check: (s, ctx) => /Нэг нууц байна/.test(ctx.lastOut),
      },
      {
        prompt: '`.daalgavar.txt`-г `mission` хавтас руу хуул (cp).',
        hint: 'cp .daalgavar.txt mission/',
        check: (s) => isFile(s, K('mission', '.daalgavar.txt')),
      },
      {
        prompt: 'Documents доторх `temdeglel.txt` файлыг устга (rm).',
        hint: 'rm Documents/temdeglel.txt',
        check: (s) => node(s, K('Documents', 'temdeglel.txt')) === null,
      },
    ],
  },

  /* ---------------- Дунд шатны сорил ---------------- */
  dund: {
    id: 'dund',
    title: 'Дунд шатны сорил',
    level: 'Дунд шат',
    intro:
      'Систем удирдлага ба текст боловсруулалт. lab хавтсанд ажиллана.',
    setup(shell) {
      const h = home(shell);
      shell.cwd = ['home', 'kali'];
      h.children.lab = D({
        'config.txt': F(
          'host=192.168.1.10\nport=8080\npassword=secret123\nuser=admin\n'
        ),
        'data1.log': F('эхний лог\n'),
        'data2.log': F('хоёр дахь лог\n'),
        'script.sh': F('#!/bin/bash\necho "сайн уу"\n'),
      });
    },
    tasks: [
      {
        prompt: '`lab` хавтас руу ор (cd).',
        hint: 'cd lab',
        check: (s) => cwdIs(s, K('lab')),
      },
      {
        prompt: '`script.sh`-д ажиллуулах эрх нэм (chmod +x).',
        hint: 'chmod +x script.sh',
        check: (s) => (node(s, K('lab', 'script.sh'))?.perms || '')[2] === 'x',
      },
      {
        prompt: '`config.txt` доторх `password` мөрийг grep-ээр ол.',
        hint: 'grep password config.txt',
        check: (s, ctx) => /password=secret123/.test(ctx.lastOut),
      },
      {
        prompt: '`lab` доторх бүх `.log` файлыг find-ээр ол.',
        hint: 'find . -name "*.log"',
        check: (s, ctx) =>
          /data1\.log/.test(ctx.lastOut) && /data2\.log/.test(ctx.lastOut),
      },
      {
        prompt: '`config.txt`-г cat хийгээд `port` мөрийг grep-ээр шүү (pipe).',
        hint: 'cat config.txt | grep port',
        check: (s, ctx) =>
          /port=8080/.test(ctx.lastOut) && /\|/.test(ctx.lastCmd),
      },
      {
        prompt: '`backup` хавтас үүсгээд `config.txt`-г түүн рүү хуул.',
        hint: 'mkdir backup && cp config.txt backup/',
        check: (s) => isFile(s, K('lab', 'backup', 'config.txt')),
      },
    ],
  },

  /* ---------------- Ахлах шатны сорил ---------------- */
  ahlah: {
    id: 'ahlah',
    title: 'Ахлах шатны сорил',
    level: 'Ахлах шат',
    intro:
      'Кибер аюулгүй байдлын дадлага. nmap болон hash командуудыг ашиглана.',
    setup(shell) {
      const h = home(shell);
      shell.cwd = ['home', 'kali'];
      delete h.children['scan.txt'];
      h.children['.creds'] = F('admin:5f4dcc3b5aa765d61d8327deb882cf99\n');
    },
    tasks: [
      {
        prompt: '192.168.1.105 хостыг nmap-аар скан хий.',
        hint: 'nmap 192.168.1.105',
        check: (s, ctx) => /Nmap scan report/.test(ctx.lastOut),
      },
      {
        prompt: 'Зөвхөн 80 портыг сканнердах (-p 80).',
        hint: 'nmap -p 80 192.168.1.105',
        check: (s, ctx) => /-p\s*80/.test(ctx.lastCmd),
      },
      {
        prompt: 'Үйлчилгээний хувилбар илрүүлэх скан хий (-sV).',
        hint: 'nmap -sV 192.168.1.105',
        check: (s, ctx) => /-sV/.test(ctx.lastCmd),
      },
      {
        prompt: 'Сканны үр дүнг `scan.txt` файлд хадгал (-oN).',
        hint: 'nmap -oN scan.txt 192.168.1.105',
        check: (s) => isFile(s, K('scan.txt')),
      },
      {
        prompt: '`scan.txt`-г уншиж шалга (cat).',
        hint: 'cat scan.txt',
        check: (s, ctx) =>
          /cat/.test(ctx.lastCmd) && /scan\.txt/.test(ctx.lastCmd),
      },
      {
        prompt: "`password` гэсэн үгийн MD5 hash-ийг гарга (echo -n | md5sum).",
        hint: 'echo -n "password" | md5sum',
        check: (s, ctx) => /5f4dcc3b5aa765d61d8327deb882cf99/.test(ctx.lastOut),
      },
    ],
  },

  /* ======================= nmap ======================= */
  nmap_anhan: {
    id: 'nmap_anhan', title: 'nmap · Анхан шатны сорил', level: 'Анхан шат',
    intro: 'nmap-ийн үндсэн скануудыг турш.',
    setup: reset(['out.txt']),
    tasks: [
      T('192.168.1.105 хостыг nmap-аар скан хий.', out(/Nmap scan report/)),
      T('Зөвхөн 22 портыг скан (-p 22).', cmd(/-p\s*22/)),
      T('Хост илрүүлэх скан хий (-sn) 192.168.1.0/24.', cmd(/-sn/)),
      T('Хурдан скан хий (-F).', cmd(/-F(\s|$)/)),
      T('Үр дүнг out.txt-д хадгал (-oN out.txt).', (s) => isFile(s, K('out.txt'))),
      T('out.txt-г уншиж шалга (cat).', cmd(/cat\s+.*out\.txt/)),
    ],
  },
  nmap_dund: {
    id: 'nmap_dund', title: 'nmap · Дунд шатны сорил', level: 'Дунд шат',
    intro: 'Скан төрөл ба гүнзгий илрүүлэлт.',
    setup: reset(),
    tasks: [
      T('SYN скан хий (-sS).', cmd(/-sS/)),
      T('Үйлчилгээний хувилбар илрүүл (-sV).', cmd(/-sV/)),
      T('Үйлдлийн систем илрүүл (-O).', cmd(/-O(\s|$)/)),
      T('Аггрессив скан хий (-A).', cmd(/-A(\s|$)/)),
      T('Үндсэн NSE script ажиллуул (-sC).', cmd(/-sC/)),
      T('Шилдэг 20 портыг скан (--top-ports 20).', cmd(/--top-ports\s*20/)),
    ],
  },
  nmap_ahlah: {
    id: 'nmap_ahlah', title: 'nmap · Ахлах шатны сорил', level: 'Ахлах шат',
    intro: 'Бүх порт, NSE vuln, нуувч ба гаралт.',
    setup: reset(['scan.xml']),
    tasks: [
      T('Бүх 65535 портыг скан (-p-).', cmd(/-p-/)),
      T('vuln script ажиллуул (--script=vuln).', cmd(/--script[ =]vuln/)),
      T('-T4 ба -Pn хослуулан скан хий.', both(cmd(/-T4/), cmd(/-Pn/))),
      T('XML гаралтад хадгал (-oX scan.xml).', (s) => isFile(s, K('scan.xml'))),
      T('Фрагмент скан хий (-f).', cmd(/-f(\s|$)/)),
      T('scanme.nmap.org-г скан хий.', cmd(/scanme/)),
    ],
  },

  /* ===================== wireshark ===================== */
  wireshark_anhan: {
    id: 'wireshark_anhan', title: 'wireshark · Анхан шатны сорил', level: 'Анхан шат',
    intro: 'tshark-аар багц барих ба үндсэн шүүлтүүр.',
    setup: reset(),
    tasks: [
      T('Интерфейсүүдийг жагсаа (tshark -D).', out(/eth0/)),
      T('eth0-оос 5 багц бари (-i eth0 -c 5).', both(cmd(/-i\s+eth0/), cmd(/-c\s*5/))),
      T('HTTP багц шүү (-Y "http").', cmd(/-Y\s*"?http/)),
      T('DNS багц шүү (-Y "dns").', cmd(/dns/)),
      T('ICMP багц шүү (-Y "icmp").', cmd(/icmp/)),
      T('Багцыг capture.pcap-д хадгал (-w capture.pcap).', cmd(/-w\s+\S+/)),
    ],
  },
  wireshark_dund: {
    id: 'wireshark_dund', title: 'wireshark · Дунд шатны сорил', level: 'Дунд шат',
    intro: 'Display filter ба талбар сонголт.',
    setup: reset(),
    tasks: [
      T('capture.pcap файлаас унш (-r capture.pcap).', cmd(/-r\s+\S+/)),
      T('tcp.port == 80 шүүлтүүр ашигла.', cmd(/tcp\.port/)),
      T('ip.addr шүүлтүүр ашигла.', cmd(/ip\.addr/)),
      T('http.request шүүлтүүр ашигла.', cmd(/http\.request/)),
      T('Талбар гарга (-T fields -e ip.src).', cmd(/-T\s+fields/)),
      T('Зөвхөн 3 багц авах (-c 3).', cmd(/-c\s*3/)),
    ],
  },
  wireshark_ahlah: {
    id: 'wireshark_ahlah', title: 'wireshark · Ахлах шатны сорил', level: 'Ахлах шат',
    intro: 'Аюулгүй байдлын шинжилгээний шүүлтүүрүүд.',
    setup: reset(),
    tasks: [
      T('TLS handshake шүү (tls.handshake).', cmd(/tls/)),
      T('ARP багц шүү (arp).', cmd(/arp/)),
      T('DNS асуултын нэр гарга (dns.qry.name).', cmd(/dns\.qry/)),
      T('TCP SYN тугтай багц шүү (tcp.flags.syn).', cmd(/tcp\.flags/)),
      T('SMB трафик шүү (smb2).', cmd(/smb/)),
      T('Kerberos трафик шүү (kerberos).', cmd(/kerberos/)),
    ],
  },

  /* ===================== metasploit ===================== */
  metasploit_anhan: {
    id: 'metasploit_anhan', title: 'metasploit · Анхан шатны сорил', level: 'Анхан шат',
    intro: 'msfconsole, module хайх ба сонгох.',
    setup: reset(),
    tasks: [
      T('msfconsole эхлүүл.', out(/metasploit/i)),
      T('eternalblue module хай (search).', cmd(/^search\b/)),
      T('Module сонго (use exploit/...).', cmd(/^use\s+\S+/)),
      T('Module-ийн мэдээлэл хар (info).', cmd(/^info/)),
      T('Тохиргоог хар (show options).', cmd(/show\s+options/)),
      T('Зорилтот хаяг тавь (set RHOSTS ...).', cmd(/set\s+RHOSTS/i)),
    ],
  },
  metasploit_dund: {
    id: 'metasploit_dund', title: 'metasploit · Дунд шатны сорил', level: 'Дунд шат',
    intro: 'Payload, handler ба exploit.',
    setup: reset(),
    tasks: [
      T('msfvenom-оор payload үүсгэ.', cmd(/^msfvenom/)),
      T('Payload тохируул (set PAYLOAD ...).', cmd(/set\s+PAYLOAD/i)),
      T('Өөрийн хаяг тавь (set LHOST ...).', cmd(/set\s+LHOST/i)),
      T('Эмзэг эсэхийг шалга (check).', cmd(/^check/)),
      T('Exploit ажиллуул.', cmd(/^exploit|^run/)),
      T('Session-уудыг жагсаа (sessions -l).', cmd(/^sessions/)),
    ],
  },
  metasploit_ahlah: {
    id: 'metasploit_ahlah', title: 'metasploit · Ахлах шатны сорил', level: 'Ахлах шат',
    intro: 'Дэвшилтэт payload, post ба session.',
    setup: reset(),
    tasks: [
      T('reverse_tcp payload бүхий msfvenom ажиллуул.', cmd(/reverse_tcp/)),
      T('Сонсох порт тавь (set LPORT ...).', cmd(/set\s+LPORT/i)),
      T('Global хаяг тавь (setg RHOSTS ...).', cmd(/^setg/)),
      T('Payload-уудыг хар (show payloads).', cmd(/show\s+payloads/)),
      T('Post module ажиллуул (run post/...).', cmd(/run\s+post\//)),
      T('Session руу ор (sessions -i 1).', cmd(/sessions\s+-i/)),
    ],
  },

  /* ==================== john / hashcat ==================== */
  john_anhan: {
    id: 'john_anhan', title: 'john / hashcat · Анхан шатны сорил', level: 'Анхан шат',
    intro: 'Hash гаргах ба үндсэн таалт.',
    setup: reset(['hash.txt']),
    tasks: [
      T('`password` үгийн MD5 hash гарга (echo -n | md5sum).', out(/5f4dcc3b5aa765d61d8327deb882cf99/)),
      T('Тэр hash-ийг hash.txt файлд хадгал (> hash.txt).', (s) => isFile(s, K('hash.txt'))),
      T('rockyou.txt.gz-г задал (gunzip).', cmd(/^gunzip/)),
      T('John-оор wordlist халдлага хий (john --wordlist=...).', cmd(/john.*--wordlist/)),
      T('Сэргээснийг хар (john --show).', cmd(/john\s+--show/)),
      T('Hashcat-аар MD5 тааллт хий (hashcat -m 0).', cmd(/hashcat.*-m\s*0/)),
    ],
  },
  john_dund: {
    id: 'john_dund', title: 'john / hashcat · Дунд шатны сорил', level: 'Дунд шат',
    intro: 'Rule, mask ба hash төрлүүд.',
    setup: reset(),
    tasks: [
      T('John-д rule ашигла (--rules).', cmd(/--rules/)),
      T('Hashcat wordlist халдлага (-a 0).', cmd(/-a\s*0/)),
      T('Hashcat mask brute-force (-a 3).', cmd(/-a\s*3/)),
      T('NTLM hash таал (hashcat -m 1000).', cmd(/-m\s*1000/)),
      T('SHA-256 hash таал (-m 1400).', cmd(/-m\s*1400/)),
      T('best64 rule ашигла (-r ...best64...).', cmd(/best64/)),
    ],
  },
  john_ahlah: {
    id: 'john_ahlah', title: 'john / hashcat · Ахлах шатны сорил', level: 'Ахлах шат',
    intro: 'Дэвшилтэт mode ба audit.',
    setup: reset(),
    tasks: [
      T('sha512crypt hash таал (-m 1800).', cmd(/-m\s*1800/)),
      T('bcrypt hash таал (-m 3200).', cmd(/-m\s*3200/)),
      T('Kerberoast hash таал (-m 13100).', cmd(/-m\s*13100/)),
      T('Session нэртэй хадгал (--session=...).', cmd(/--session/)),
      T('Hashcat benchmark хий (-b).', cmd(/-b(\s|$)/)),
      T('`admin` үгийн MD5 hash гарга (md5sum).', out(/21232f297a57a5a743894a0e4a801fc3/)),
    ],
  },
};

export default CHALLENGES;
