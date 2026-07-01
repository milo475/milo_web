/* wireshark — 90 хичээл (Анхан 30 · Дунд 30 · Ахлах 30) */
import { p, h, c, li, note, warn, L, buildCourse } from './_helpers.js';

const anhan = [
  L('Wireshark гэж юу вэ', 'Багц шинжлэгчийн танилцуулга.', [
    p('Wireshark нь сүлжээгээр дамжих багц бүрийг барьж аваад нарийвчлан шинжилдэг график хэрэгсэл.'),
    warn('Зөвхөн өөрийн/зөвшөөрөлтэй сүлжээний трафик барина. Бусдынхыг чагнах хууль бус.'),
  ]),
  L('Суулгах', 'Kali дээр суулгах.', [
    c('sudo apt install wireshark'),
    c('tshark --version', 'TShark (Wireshark) 4.2.0'),
  ]),
  L('GUI ба tshark', 'График ба командын хувилбар.', [
    p('Wireshark нь GUI, tshark нь түүний CLI хувилбар. Сервер дээр tshark тохиромжтой.'),
  ]),
  L('Интерфейс жагсаах', 'Аль картаас барих вэ.', [
    c('tshark -D', '1. eth0\n2. lo (Loopback)\n3. any'),
  ]),
  L('Эхний capture', 'Багц барьж эхлэх.', [
    c('tshark -i eth0 -c 5'),
    note('-c 5 нь 5 багц барьж аваад зогсоно.'),
  ]),
  L('Багцын мөр унших', 'Гаралтын баганууд.', [
    p('Дугаар | хугацаа | эх → хүлээн авагч | протокол | урт | тайлбар.'),
  ]),
  L('Багцын давхаргууд', 'Frame, Ethernet, IP, TCP.', [
    li('Frame — физик багц', 'Ethernet — MAC хаяг', 'IP — IP хаяг', 'TCP/UDP — порт'),
  ]),
  L('Ethernet давхарга', 'MAC хаягууд.', [
    p('Эх ба хүлээн авагч MAC хаяг (08:00:27:...) физик төхөөрөмжийг заана.'),
  ]),
  L('IP давхарга', 'Эх/хүлээн авагч IP.', [
    p('IP толгой нь хаанаас хаашаа явахыг, TTL, протоколыг агуулна.'),
  ]),
  L('TCP давхарга', 'Порт ба туг.', [
    li('SYN — холболт эхлүүлэх', 'ACK — баталгаажуулах', 'FIN — хаах', 'RST — таслах'),
  ]),
  L('Протокол таних', 'HTTP, DNS, ICMP, ARP.', [
    li('HTTP — веб', 'DNS — нэр шийдвэрлэх', 'ICMP — ping', 'ARP — MAC олох'),
  ]),
  L('Багцыг тоолох', '-c туг.', [
    c('tshark -i eth0 -c 100'),
  ]),
  L('Хугацаа харах', 'Timestamp.', [
    p('Багц хооронд хэр хугацаа өнгөрснийг харж гацаа, удаашралыг олно.'),
  ]),
  L('Capture зогсоох', 'GUI ба CLI.', [
    note('GUI-д улаан "stop" товч. tshark-д Ctrl+C эсвэл -c хязгаар.'),
  ]),
  L('Display filter гэж юу вэ', 'Барьсныг шүүх.', [
    p('Display filter нь барьсан багцаас хэрэгтэйг нь л харуулна. Capture filter нь барих үед шүүнэ.'),
  ]),
  L('IP-ээр шүүх', 'ip.addr filter.', [
    c('tshark -i eth0 -Y "ip.addr == 192.168.1.105" -c 5'),
  ]),
  L('Порт-оор шүүх', 'tcp.port filter.', [
    c('tshark -i eth0 -Y "tcp.port == 80" -c 5'),
  ]),
  L('Протоколоор шүүх', 'http, dns filter.', [
    c('tshark -i eth0 -Y "http" -c 3'),
  ]),
  L('DNS шүүх', 'dns filter.', [
    c('tshark -i eth0 -Y "dns" -c 5'),
  ]),
  L('ICMP (ping) шүүх', 'icmp filter.', [
    c('tshark -i eth0 -Y "icmp" -c 5'),
  ]),
  L('Логик оператор', 'and, or, not.', [
    c('tshark -Y "ip.addr==192.168.1.1 and tcp.port==80"'),
    li('and — хоёулаа', 'or — аль нэг', 'not — үгүйсгэх'),
  ]),
  L('Харьцуулах оператор', '==, !=, >, <.', [
    c('tshark -Y "tcp.port > 1000"'),
  ]),
  L('HTTP хүсэлт шүүх', 'http.request.', [
    c('tshark -Y "http.request" -c 3'),
  ]),
  L('Эх/хүлээн авагч', 'ip.src, ip.dst.', [
    c('tshark -Y "ip.src == 192.168.1.105"'),
  ]),
  L('Файлд хадгалах', '-w pcap.', [
    c('tshark -i eth0 -c 100 -w capture.pcap'),
  ]),
  L('Файлаас унших', '-r pcap.', [
    c('tshark -r capture.pcap -Y "http.request"'),
  ]),
  L('pcap гэж юу вэ', 'Стандарт формат.', [
    p('.pcap нь барьсан багцыг хадгалах стандарт формат. Бусад хэрэгсэлд нийцнэ.'),
  ]),
  L('Багцын тоо хэмжээ', 'Урт, нийт.', [
    c('tshark -r capture.pcap | wc -l'),
  ]),
  L('GUI өнгөний дүрэм', 'Багцыг өнгөөр ялгах.', [
    note('GUI-д Wireshark протоколоор автоматаар өнгөөр ялгана — алдаа улаан.'),
  ]),
  L('Анхан шатны давталт', 'Capture ба filter.', [
    li('-D интерфейс', '-i -c capture', '-Y display filter', '-w/-r файл'),
  ]),
];

const dund = [
  L('Capture filter (BPF)', 'Барих үед шүүх.', [
    c('tshark -i eth0 -f "tcp port 80"'),
    note('-f нь capture filter (BPF синтакс), -Y нь display filter. Хоёр өөр.'),
  ]),
  L('host capture filter', 'Тодорхой хост.', [
    c('tshark -i eth0 -f "host 192.168.1.105"'),
  ]),
  L('net capture filter', 'Дэд сүлжээ.', [
    c('tshark -i eth0 -f "net 192.168.1.0/24"'),
  ]),
  L('TCP stream дагах', 'Нэг харилцаа сэргээх.', [
    c('tshark -r capture.pcap -z follow,tcp,ascii,0'),
    note('GUI-д багц дээр баруун товш → Follow → TCP Stream.'),
  ]),
  L('stream дугаар', 'tcp.stream.', [
    c('tshark -Y "tcp.stream == 0"'),
  ]),
  L('HTTP агуулга харах', 'http.file_data.', [
    c('tshark -r capture.pcap -Y http -T fields -e http.host -e http.request.uri'),
  ]),
  L('Талбар сонгох (-T fields)', 'Тодорхой утга гаргах.', [
    c('tshark -r capture.pcap -T fields -e ip.src -e ip.dst'),
  ]),
  L('Статистик — protocol hierarchy', 'Ямар протокол давамгайлж байна.', [
    c('tshark -r capture.pcap -z io,phs -q'),
  ]),
  L('Статистик — conversations', 'Хэн хэнтэй ярьж байна.', [
    c('tshark -r capture.pcap -z conv,tcp -q'),
  ]),
  L('Статистик — endpoints', 'Идэвхтэй хостууд.', [
    c('tshark -r capture.pcap -z endpoints,ip -q'),
  ]),
  L('IO график', 'Цаг хугацааны ачаалал.', [
    c('tshark -r capture.pcap -z io,stat,1 -q'),
  ]),
  L('DNS шинжлэх', 'Асуулга/хариу.', [
    c('tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name'),
  ]),
  L('ARP шинжлэх', 'MAC-IP холбоо.', [
    c('tshark -Y "arp"'),
    note('ARP spoofing илрүүлэхэд хэрэгтэй.'),
  ]),
  L('TLS handshake', 'Шифрлэлт эхлэл.', [
    c('tshark -Y "tls.handshake"'),
  ]),
  L('SNI харах', 'Шифрлэгдсэн ч домэйн.', [
    c('tshark -Y "tls.handshake.extensions_server_name" -T fields -e tls.handshake.extensions_server_name'),
  ]),
  L('HTTP объект задлах', 'Файл сэргээх.', [
    note('GUI: File → Export Objects → HTTP. Дамжсан зураг, файлыг сэргээнэ.'),
  ]),
  L('Credential хайх', 'Шифрлэгдээгүй нэвтрэлт.', [
    c('tshark -Y "http.authbasic || ftp.request.command==PASS"'),
    warn('HTTP/FTP нь нууц үгийг ил дамжуулдаг — иймээс HTTPS чухал.'),
  ]),
  L('Багцын урт шүүх', 'frame.len.', [
    c('tshark -Y "frame.len > 1000"'),
  ]),
  L('Хугацааны муж', 'frame.time.', [
    c('tshark -Y "frame.time >= \\"2026-06-30 14:00:00\\""'),
  ]),
  L('TCP алдаа', 'Retransmission, дахилт.', [
    c('tshark -Y "tcp.analysis.retransmission"'),
    note('Сүлжээний асуудал, гацааг олоход.'),
  ]),
  L('RST багц', 'Холболт таслалт.', [
    c('tshark -Y "tcp.flags.reset == 1"'),
  ]),
  L('SYN flood шинжлэх', 'Олон SYN.', [
    c('tshark -Y "tcp.flags.syn==1 and tcp.flags.ack==0"'),
  ]),
  L('Гаралтын формат', '-T json, -T pdml.', [
    c('tshark -r capture.pcap -T json'),
  ]),
  L('editcap — pcap засах', 'Файл хуваах/огтлох.', [
    c('editcap -c 1000 big.pcap small.pcap'),
    note('Том pcap-ийг жижиг хэсэг болгон хуваана.'),
  ]),
  L('mergecap — нэгтгэх', 'Олон pcap нэгтгэх.', [
    c('mergecap -w all.pcap file1.pcap file2.pcap'),
  ]),
  L('capinfos — мэдээлэл', 'pcap-ийн тойм.', [
    c('capinfos capture.pcap'),
  ]),
  L('Хугацааны бүс', 'Timestamp нарийвчлал.', [
    note('-t туг хугацааны форматыг сонгоно (abs, rel, delta).'),
  ]),
  L('Ring buffer', 'Тасралтгүй capture.', [
    c('tshark -i eth0 -b filesize:10000 -b files:5 -w cap.pcap'),
    note('Дискийг дүүргэхгүйгээр удаан capture хийнэ.'),
  ]),
  L('HTTP статистик', '-z http,tree.', [
    c('tshark -r capture.pcap -z http,tree -q'),
    note('HTTP хүсэлт, хариу, status code-ийн нэгдсэн статистик гаргана.'),
  ]),
  L('Дунд шатны давталт', 'Filter, статистик, задлал.', [
    li('capture vs display filter', '-T fields талбар', '-z статистик', 'editcap/mergecap'),
  ]),
];

const ahlah = [
  L('Malware трафик шинжлэх', 'Сэжигтэй холболт олох.', [
    p('C2 (command & control) трафик нь тогтмол интервал, ховор домэйн, кодлогдсон payload-аар илэрнэ.'),
    warn('Зөвхөн тусгаарлагдсан лаб/sandbox орчинд шинжил.'),
  ]),
  L('Beaconing илрүүлэх', 'Тогтмол интервал.', [
    c('tshark -r cap.pcap -z conv,tcp -q'),
    note('Ижил хост руу тогтмол давтамжтай холболт нь beacon байж болзошгүй.'),
  ]),
  L('DNS tunneling', 'DNS-ээр өгөгдөл нуух.', [
    c('tshark -Y "dns.qry.name.len > 50"'),
    note('Хэт урт DNS асуулга нь tunneling-ийн шинж.'),
  ]),
  L('Exfiltration илрүүлэх', 'Гадагшаа их өгөгдөл.', [
    c('tshark -r cap.pcap -z endpoints,ip -q'),
  ]),
  L('TLS гэрчилгээ шинжлэх', 'Хуурамч CA.', [
    c('tshark -Y "tls.handshake.type == 11"'),
  ]),
  L('JA3 хурууны хээ', 'TLS клиент таних.', [
    note('JA3 нь TLS handshake-ийн онцлогоор клиент/malware-ийг таних арга.'),
  ]),
  L('SMB халдлага', 'Lateral movement.', [
    c('tshark -Y "smb2"'),
  ]),
  L('Kerberos шинжлэх', 'AD халдлага.', [
    c('tshark -Y "kerberos"'),
    note('Kerberoasting зэрэг халдлагыг трафикаас илрүүлж болно.'),
  ]),
  L('ARP spoofing илрүүлэх', 'MITM шинж.', [
    c('tshark -Y "arp.duplicate-address-detected"'),
  ]),
  L('Custom column', 'GUI тохиргоо.', [
    note('GUI-д өөрийн хэрэгтэй талбарыг багана болгож нэмж болно.'),
  ]),
  L('Coloring rule custom', 'Анхаарал татах.', [
    note('Тодорхой нөхцөлд тохирох багцыг тод өнгөөр ялгаж тохируулна.'),
  ]),
  L('Lua dissector', 'Шинэ протокол задлах.', [
    p('Wireshark-ийн Lua API-аар захиалгат протоколын dissector бичиж болно.'),
  ]),
  L('tshark + bash', 'Автоматжуулалт.', [
    c('for f in *.pcap; do tshark -r $f -Y http.request -T fields -e http.host >> hosts.txt; done'),
  ]),
  L('Том pcap боловсруулах', 'Гүйцэтгэл.', [
    li('editcap-аар хуваах', 'capture filter-ээр багасгах', '-T fields-ээр зөвхөн хэрэгтэйг'),
  ]),
  L('Wi-Fi трафик (monitor)', '802.11 барих.', [
    c('sudo airmon-ng start wlan0'),
    note('Monitor mode-д Wireshark Wi-Fi management багцыг харна.'),
  ]),
  L('WPA handshake барих', 'EAPOL.', [
    c('tshark -i wlan0mon -Y "eapol"'),
    warn('Зөвхөн өөрийн WiFi-д. Барьсан handshake-ийг aircrack-ng-аар тестэлнэ.'),
  ]),
  L('VoIP шинжлэх', 'SIP/RTP.', [
    c('tshark -Y "sip"'),
    note('GUI-д Telephony → VoIP Calls дуудлагыг сэргээнэ.'),
  ]),
  L('USB трафик', 'usbmon.', [
    note('Wireshark USB төхөөрөмжийн трафикийг ч барьж чадна (CTF-д түгээмэл).'),
  ]),
  L('IO статистик гүнзгий', 'Тренд шинжлэх.', [
    c('tshark -r cap.pcap -z io,stat,10,"COUNT(frame)frame" -q'),
  ]),
  L('Expert info', 'Алдаа, анхааруулга.', [
    note('GUI: Analyze → Expert Information — алдаа, дахилт, анхааруулгыг нэгтгэнэ.'),
  ]),
  L('Багц засаж дахин тоглуулах', 'tcpreplay.', [
    c('sudo tcpreplay -i eth0 capture.pcap'),
    warn('Барьсан трафикийг дахин илгээнэ — зөвхөн лаб орчинд.'),
  ]),
  L('Forensics workflow', 'Үйл явдал сэргээх.', [
    li('Хугацааны мөр гаргах', 'Сэжигтэй холболт ялгах', 'Файл/credential сэргээх', 'Тайлагнах'),
  ]),
  L('CTF pcap бодлого', 'Нуусан flag олох.', [
    c('strings capture.pcap | grep -i flag'),
    note('CTF-д flag ихэвчлэн HTTP, DNS, эсвэл файл доторх текстэд нуугдсан байдаг.'),
  ]),
  L('Шифрлэлт тайлах', 'TLS key ашиглах.', [
    note('Серверийн хувийн түлхүүр эсвэл SSLKEYLOGFILE байвал TLS-ийг тайлж агуулгыг харна.'),
  ]),
  L('Гүйцэтгэл тааруулах', 'Том орчинд.', [
    li('Ring buffer', 'capture filter нарийн', 'GUI-гүй tshark'),
  ]),
  L('IDS-тэй хослуулах', 'Snort/Suricata.', [
    p('Wireshark гар аргын гүн шинжилгээ, IDS автомат илрүүлэлт — хоёр нь нөхдөг.'),
  ]),
  L('Тайлан бичих', 'Олдвор баримтжуулах.', [
    li('Багцын дугаар, хугацаа', 'Дэлгэцийн зураг (PoC)', 'Нөлөө ба зөвлөмж'),
  ]),
  L('Хувийн нууц ба хууль', 'Ёс зүйн хязгаар.', [
    warn('Трафик дотор хувийн мэдээлэл байдаг. Зөвшөөрөлгүй барих, задлах нь хууль зөрчинө.'),
  ]),
  L('Бусад хэрэгсэл', 'tcpdump, ngrep, zeek.', [
    li('tcpdump — хөнгөн CLI', 'ngrep — текст хайх', 'zeek — сүлжээний лог шинжилгээ'),
  ]),
  L('Ахлах шатны дүгнэлт', 'Wireshark мастер зам.', [
    p('Та capture, filter, статистик, аюулгүй байдлын шинжилгээг эзэмшлээ.'),
    note('Цааш: Lua dissector, malware traffic analysis, forensics гүнзгийрүүл.'),
  ]),
];

export const WIRESHARK90 = buildCourse('wireshark', 'wireshark', 'Трафик шинжлэх · 90 хичээл', { anhan, dund, ahlah });
export default WIRESHARK90;
