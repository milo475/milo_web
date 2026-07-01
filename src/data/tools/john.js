/* john / hashcat — 90 хичээл (Анхан 30 · Дунд 30 · Ахлах 30) */
import { p, h, c, li, note, warn, L, buildCourse } from './_helpers.js';

const anhan = [
  L('Нууц үг сэргээх гэж юу вэ', 'Hash, audit, ёс зүй.', [
    p('Систем нууц үгийг hash хэлбэрээр хадгалдаг. Нууц үг сэргээх нь тэр hash-аас анхны үгийг таах процесс — нууц үгийн бат бөхийг үнэлэхэд.'),
    warn('Зөвхөн өөрийн/зөвшөөрөлтэй hash-д. Бусдын нууц үг таах нь хууль бус.'),
  ]),
  L('Hash гэж юу вэ', 'Нэг чиглэлт функц.', [
    p('Hash нь өгөгдлийг тогтмол урттай дүрс болгон хувиргадаг нэг чиглэлт функц. Буцаах боломжгүй.'),
    c('echo -n "password123" | md5sum', '482c811da5d5b4bc6d497ffa98491e38  -'),
  ]),
  L('Hash төрлүүд', 'MD5, SHA, NTLM, bcrypt.', [
    li('MD5 — хуучин, хурдан, сул', 'SHA-1/256 — түгээмэл', 'NTLM — Windows', 'bcrypt/argon2 — удаан, бат бөх'),
  ]),
  L('John ба Hashcat', 'Хоёр гол хэрэгсэл.', [
    li('John the Ripper — уян хатан, CPU', 'Hashcat — GPU, маш хурдан'),
  ]),
  L('Суулгах', 'Kali дээр.', [
    c('sudo apt install john hashcat'),
  ]),
  L('Wordlist гэж юу вэ', 'Нэр үгийн жагсаалт.', [
    p('Wordlist нь турших нууц үгсийн жагсаалт. Хамгийн алдартай нь rockyou.txt (14 сая+).'),
  ]),
  L('rockyou бэлдэх', 'gunzip.', [
    c('sudo gunzip /usr/share/wordlists/rockyou.txt.gz'),
    c('wc -l /usr/share/wordlists/rockyou.txt'),
  ]),
  L('Эхний John ажиллуулалт', 'Энгийн таалт.', [
    c('john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt', 'password123  (user1)\n1 password hash cracked'),
  ]),
  L('Сэргээснийг харах', 'john --show.', [
    c('john --show hashes.txt', 'user1:password123\n1 password hash cracked, 0 left'),
  ]),
  L('Эхний Hashcat', 'MD5 таалт.', [
    c('hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt', 'Status: Cracked\n482c811...:password123'),
  ]),
  L('Hashcat mode (-m)', 'Hash төрлийн дугаар.', [
    li('-m 0 MD5', '-m 100 SHA1', '-m 1400 SHA-256', '-m 1000 NTLM'),
  ]),
  L('Hashcat attack (-a)', 'Халдлагын төрөл.', [
    li('-a 0 wordlist', '-a 3 brute-force (mask)', '-a 1 combinator', '-a 6 hybrid'),
  ]),
  L('Hash таних', 'hashid.', [
    c('hashid 482c811da5d5b4bc6d497ffa98491e38'),
    note('Hash төрлийг мэдэхгүй бол hashid/hash-identifier тусална.'),
  ]),
  L('Hash файл бэлдэх', 'Нэг мөр нэг hash.', [
    c('echo "482c811da5d5b4bc6d497ffa98491e38" > hash.txt'),
  ]),
  L('Linux нууц үг', 'unshadow.', [
    c('sudo unshadow /etc/passwd /etc/shadow > hashes.txt'),
    note('John-д өгөхийн тулд passwd, shadow-г нэгтгэнэ.'),
  ]),
  L('John формат', '--format.', [
    c('john --format=raw-md5 hash.txt'),
  ]),
  L('John форматууд жагсаах', '--list.', [
    c('john --list=formats | head'),
  ]),
  L('Hashcat жишээ hash', '--example-hashes.', [
    c('hashcat --example-hashes | head'),
    note('Mode бүрийн hash формат жишээг харуулна.'),
  ]),
  L('Гүйцэтгэл харах', 'Status.', [
    note('Hashcat ажиллаж байх үед s дарж статус, p дарж завсарлана.'),
  ]),
  L('potfile', 'Сэргээснийг хадгалах.', [
    p('Hashcat сэргээсэн hash-ийг hashcat.potfile-д, John нь ~/.john/john.pot-д хадгална.'),
  ]),
  L('Дахин эхлүүлэхгүй', 'pot ашиглах.', [
    c('hashcat -m 0 hash.txt rockyou.txt --show'),
    note('--show нь pot-оос аль хэдийн сэргээснийг харуулна.'),
  ]),
  L('SHA-256 таалт', 'Жишээ.', [
    c('hashcat -m 1400 -a 0 sha256.txt rockyou.txt'),
  ]),
  L('NTLM таалт', 'Windows hash.', [
    c('hashcat -m 1000 -a 0 ntlm.txt rockyou.txt'),
  ]),
  L('Олон hash зэрэг', 'Файл дотор олон.', [
    p('Файлд олон hash байвал хэрэгсэл бүгдийг зэрэг туршина.'),
  ]),
  L('Том/жижиг үсэг', 'Rule-ийн хэрэгцээ.', [
    note('Password ба password нь өөр hash. Rule-ээр хувилбаруудыг үүсгэнэ (дунд шат).'),
  ]),
  L('Зөв wordlist сонгох', 'Контекст.', [
    li('rockyou — ерөнхий', 'SecLists — олон төрөл', 'захиалгат — зорилтот байгууллагын үг'),
  ]),
  L('Хурд хэмжих', 'Benchmark.', [
    c('hashcat -b -m 0'),
  ]),
  L('CPU vs GPU', 'Ялгаа.', [
    p('Hashcat GPU ашиглаж секундэд тэрбум hash тооцоолно. John уян хатан ч CPU-д удаан.'),
  ]),
  L('Ёс зүйн сануулга', 'Хязгаар.', [
    warn('Зөвхөн өөрийн эзэмшлийн hash, эсвэл бичгээр зөвшөөрөлтэй pentest-д.'),
  ]),
  L('Анхан шатны давталт', 'Үндсэн таалт.', [
    li('Hash таних', 'wordlist халдлага', 'john --show / hashcat --show', 'mode -m, attack -a'),
  ]),
];

const dund = [
  L('John rules', 'Үг хувиргах дүрэм.', [
    c('john --wordlist=rockyou.txt --rules hashes.txt'),
    note('Rule нь password → Password1, p@ssw0rd зэрэг хувилбар үүсгэнэ.'),
  ]),
  L('John single mode', 'Хэрэглэгчийн нэрээс.', [
    c('john --single hashes.txt'),
  ]),
  L('John incremental', 'Brute-force.', [
    c('john --incremental hashes.txt'),
  ]),
  L('Hashcat rules', '-r дүрэм файл.', [
    c('hashcat -m 0 -a 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule'),
  ]),
  L('best64 rule', 'Түгээмэл дүрэм.', [
    p('best64.rule нь хамгийн үр дүнтэй 64 хувиргалт — wordlist-ийг хүчирхэгжүүлнэ.'),
  ]),
  L('Mask attack үндэс', '-a 3.', [
    c('hashcat -m 0 -a 3 hash.txt ?d?d?d?d?d?d'),
    li('?d тоо', '?l жижиг үсэг', '?u том үсэг', '?s тэмдэгт', '?a бүгд'),
  ]),
  L('Custom mask', 'Тодорхой загвар.', [
    c('hashcat -m 0 -a 3 hash.txt "Pass?d?d?d?d"'),
    note('Нууц үгийн загвар мэдэгдэж байвал brute-force-ийг хязгаарлана.'),
  ]),
  L('Mask increment', '--increment.', [
    c('hashcat -m 0 -a 3 --increment hash.txt ?a?a?a?a?a?a'),
  ]),
  L('Custom charset', '-1 -2.', [
    c('hashcat -m 0 -a 3 -1 ?l?d hash.txt ?1?1?1?1'),
  ]),
  L('Hybrid attack', 'Wordlist + mask.', [
    c('hashcat -m 0 -a 6 hash.txt rockyou.txt ?d?d?d'),
    note('Үг + тоо (password123) хэв маягийг барина.'),
  ]),
  L('Combinator', '-a 1.', [
    c('hashcat -m 0 -a 1 hash.txt words1.txt words2.txt'),
  ]),
  L('zip нууц үг', 'zip2john.', [
    c('zip2john secret.zip > zip.hash'),
    c('john zip.hash --wordlist=rockyou.txt'),
  ]),
  L('rar нууц үг', 'rar2john.', [
    c('rar2john secret.rar > rar.hash'),
  ]),
  L('PDF нууц үг', 'pdf2john.', [
    c('pdf2john secret.pdf > pdf.hash'),
  ]),
  L('SSH түлхүүр', 'ssh2john.', [
    c('ssh2john id_rsa > ssh.hash'),
    c('john ssh.hash --wordlist=rockyou.txt'),
  ]),
  L('Office баримт', 'office2john.', [
    c('office2john document.docx > office.hash'),
  ]),
  L('WPA handshake', 'Wi-Fi нууц үг.', [
    c('hashcat -m 22000 -a 0 wifi.hc22000 rockyou.txt'),
    warn('Зөвхөн өөрийн WiFi-н handshake-д.'),
  ]),
  L('Sudo/shadow hash', 'sha512crypt.', [
    c('hashcat -m 1800 -a 0 shadow.txt rockyou.txt'),
  ]),
  L('bcrypt', 'Удаан hash.', [
    c('hashcat -m 3200 -a 0 bcrypt.txt rockyou.txt'),
    note('bcrypt зориуд удаан — таалт маш удаан болно (бат бөхийн шинж).'),
  ]),
  L('Гүйцэтгэл тааруулах', '-w workload.', [
    c('hashcat -m 0 -w 3 hash.txt rockyou.txt'),
    note('-w 1..4 — GPU ачааллын түвшин.'),
  ]),
  L('Session хадгалах', '--session.', [
    c('hashcat --session=job1 -m 0 hash.txt rockyou.txt'),
  ]),
  L('Session сэргээх', '--restore.', [
    c('hashcat --session=job1 --restore'),
  ]),
  L('Хэдэн hash зэрэг', 'Олон target.', [
    p('Hashcat нэг файлд олон hash байхад бүгдийг параллель таална — нэг бүрийг тус тусд биш.'),
  ]),
  L('John потенциал нэгтгэх', 'Хэд хэдэн машин.', [
    note('John-ийг node болгон хувааж distributed cracking хийж болно (--node).'),
  ]),
  L('Wordlist үүсгэх — crunch', 'Захиалгат.', [
    c('crunch 6 8 -o wordlist.txt'),
  ]),
  L('cewl — вэбээс', 'Сайтаас үг цуглуулах.', [
    c('cewl https://example.com -w custom.txt'),
    note('Зорилтот байгууллагын вэбээс түгээмэл үг цуглуулна.'),
  ]),
  L('Mentalist/маск дүрэм', 'Ухаалаг wordlist.', [
    p('Хүний нууц үгийн хэв маяг (нэр+он, том үсэг+тэмдэгт)-ийг дуурайн зорилтот wordlist үүсгэнэ.'),
  ]),
  L('Хослуулсан стратеги', 'Wordlist→rule→mask.', [
    li('1. rockyou + best64', '2. зорилтот cewl wordlist', '3. mask brute үлдсэнд'),
  ]),
  L('Гүйцэтгэлийн тооцоо', 'Хугацаа таамаглах.', [
    note('Keyspace ÷ hash/sec = хугацаа. bcrypt дээр brute-force бараг боломжгүй.'),
  ]),
  L('Дунд шатны давталт', 'Rule, mask, файл формат.', [
    li('rules (best64)', 'mask -a 3', 'hybrid -a 6', 'zip/ssh/office2john'),
  ]),
];

const ahlah = [
  L('Cracking аргачлал', 'Үр дүнтэй дараалал.', [
    li('1. Хурдан wordlist (rockyou)', '2. wordlist + rules', '3. зорилтот wordlist (cewl)', '4. mask/hybrid', '5. brute (сүүлд)'),
  ]),
  L('Keyspace ойлгох', 'Хэмжээ тооцох.', [
    p('8 тэмдэгт бүх төрлөөр ≈ 6.6 их наяд хувилбар. GPU-д ч цаг шаардана. Урт нь экспоненциал хамгаалалт.'),
  ]),
  L('Distributed cracking', 'Олон GPU.', [
    note('hashtopolis зэрэг систем олон машины GPU-г нэгтгэж асар их хурд өгнө.'),
  ]),
  L('Rule бичих', 'Захиалгат хувиргалт.', [
    c('echo "c $1 $2 $3" > custom.rule'),
    note('Rule синтакс: c=capitalize, $X=нэмэх, ^X=урд нэмэх гэх мэт.'),
  ]),
  L('Rule stacking', 'Олон дүрэм.', [
    c('hashcat -m 0 hash.txt wl.txt -r best64.rule -r toggles.rule'),
  ]),
  L('Markov chain', 'Статистик дараалал.', [
    note('Hashcat Markov загвараар магадлалтай тэмдэгт дарааллыг эхэлж туршина.'),
  ]),
  L('PRINCE attack', 'Үг нийлүүлэх.', [
    p('PRINCE нь wordlist-ийн үгсийг нийлүүлж шинэ нэр томьёо үүсгэдэг дэвшилтэт халдлага.'),
  ]),
  L('Pause/checkpoint', 'Удаан ажил удирдах.', [
    note('Hashcat-д c=checkpoint, q=quit. Session-аар сэргээнэ.'),
  ]),
  L('Temperature/abort', 'Техник хамгаалах.', [
    c('hashcat --hwmon-temp-abort=90 -m 0 hash.txt wl.txt'),
  ]),
  L('NTLM ба AD', 'Домэйн орчин.', [
    c('hashcat -m 1000 -a 0 ntds.txt rockyou.txt -r best64.rule'),
    warn('ntds.dit-аас гаргасан hash зөвхөн зөвшөөрөлтэй AD тестэд.'),
  ]),
  L('Kerberoasting hash', 'TGS-REP.', [
    c('hashcat -m 13100 -a 0 kerb.txt rockyou.txt'),
  ]),
  L('AS-REP roasting', 'm 18200.', [
    c('hashcat -m 18200 -a 0 asrep.txt rockyou.txt'),
  ]),
  L('Pass-the-hash холбоо', 'Таалтгүй ашиглах.', [
    p('Зарим тохиолдолд hash-ийг таалгүйгээр шууд нэвтрэлтэд (PtH) ашиглаж болно.'),
  ]),
  L('Salt ойлгох', 'Rainbow table эсэргүүцэл.', [
    p('Salt нь hash бүрд санамсаргүй утга нэмж, урьдчилан тооцоолсон (rainbow) хүснэгтийг ашиггүй болгоно.'),
  ]),
  L('Rainbow table', 'Хуучин техник.', [
    note('Salt-гүй hash-д урьдчилан тооцсон хүснэгт ашигладаг байсан. Орчин үед salt-аар хаагдсан.'),
  ]),
  L('Хослол: hashcat + nmap', 'Бодит урсгал.', [
    p('nmap/enumeration-аар олсон үйлчилгээний hash-ийг hashcat-аар audit хийнэ.'),
  ]),
  L('John MPI/fork', 'Олон цөм.', [
    c('john --fork=4 hashes.txt --wordlist=rockyou.txt'),
  ]),
  L('Hash гаргаж авах эх', 'DB, dump.', [
    note('Веб апп, DB dump-аас hash гарна. Зөвхөн зөвшөөрөлтэй өгөгдөлд ажилла.'),
  ]),
  L('Cracking лаб байгуулах', 'Дадлага.', [
    p('Өөрийн hash үүсгээд (openssl/md5sum) таалт хийж дадлагажина — аюулгүй.'),
    c('openssl passwd -1 -salt xyz password123'),
  ]),
  L('Гүйцэтгэлийн хязгаар', 'bcrypt/argon2.', [
    p('Орчин үеийн удаан hash-д brute-force бараг боломжгүй — энэ нь зөв хамгаалалтын жишээ.'),
  ]),
  L('Хамгаалалт — урт', 'Passphrase.', [
    li('16+ тэмдэгт passphrase', 'Толь бичгийн үг бус', 'Урт > нарийн төвөгтэй'),
  ]),
  L('Хамгаалалт — алгоритм', 'Зөв hash сонгох.', [
    li('bcrypt, scrypt, argon2 ашиглах', 'MD5/SHA1  битгий хэрэглэ', 'Salt заавал'),
  ]),
  L('Хамгаалалт — бодлого', 'Байгууллагын түвшин.', [
    li('Давтагдашгүй нууц үг + менежер', '2FA заавал', 'Алдагдсан нууц үгийн шалгалт (HIBP)'),
  ]),
  L('Audit тайлан', 'Үр дүн илэрхийлэх.', [
    li('Хэдэн % сэргээгдсэн', 'Хамгийн түгээмэл сул нууц үг', 'Бодлогын зөвлөмж'),
  ]),
  L('Responsible disclosure', 'Олдвор зохицуулах.', [
    warn('Сэргээсэн нууц үгийг задруулахгүй, зөвхөн эзэнд нь аюулгүйгээр мэдэгдэнэ.'),
  ]),
  L('Хууль эрх зүй', 'Хязгаар.', [
    warn('Зөвшөөрөлгүй hash таах, нэвтрэх нь гэмт хэрэг. Audit зөвшөөрөл бичгээр.'),
  ]),
  L('CTF дадлага', 'Хууль ёсны сорилт.', [
    p('CrackMe, CTF-ийн crypto бодлого дээр аюулгүйгээр ур чадвараа сорь.'),
  ]),
  L('Бусад хэрэгсэл', 'hydra, medusa.', [
    li('hashcat/john — offline (hash)', 'hydra/medusa — online (үйлчилгээ)'),
  ]),
  L('GPU rig ба cloud', 'Том хүчин чадал.', [
    note('Олон GPU-тэй rig эсвэл cloud (зөвшөөрөлтэй) ашиглаж хурдыг нэмэгдүүлдэг.'),
  ]),
  L('Ахлах шатны дүгнэлт', 'Мастер зам.', [
    p('Та rule, mask, дэвшилтэт халдлага, AD hash, хамгаалалтыг судаллаа.'),
    note('Цааш: AD аюулгүй байдал, custom rule, distributed cracking.'),
  ]),
];

export const JOHN90 = buildCourse('john', 'john / hashcat', 'Нууц үг audit · 90 хичээл', { anhan, dund, ahlah });
export default JOHN90;
