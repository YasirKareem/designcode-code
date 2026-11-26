# البطاقات السينمائية المتحركة

واجهة سياحية بعنوان **Explore the World** وأربع وجهات بصور حقيقية. عند الضغط على
التالي أو السابق، أو اختيار بطاقة مباشرة، تكبر البطاقة نفسها من مكانها حتى تملأ
الواجهة وتصبح الخلفية الجديدة، وتتبدل الكلمات، وتنزلق البطاقات الأخرى إلى أماكنها
الجديدة، وتعود الوجهة السابقة إلى آخر الصف. HTML + CSS + JavaScript فقط، بدون مكتبات.

## التشغيل

1. حمّل المجلد كاملًا (مع `assets/images/`).
2. افتح `index.html` بنقرة مزدوجة. النسخة العربية (من اليمين لليسار): `ar.html`.

## كيف تعمل

| الجزء | الفكرة |
|---|---|
| الحالة | `current` رقم الوجهة المعروضة. البطاقات الأخرى تُرتب دائريًا بخاصية `order` في flex، ولا يُستبدل أي عنصر في الصفحة |
| Card-to-Hero | نسخة من صورة البطاقة تُوضع فوقها تمامًا (`getBoundingClientRect()`)، ثم تكبر بـ Web Animations API إلى كامل الواجهة: الموضع والعرض والارتفاع وتدوير الزوايا، خلال 1 ث |
| بلا تشويه | الصورة داخل النسخة بـ `object-fit: cover`، فيتغير القص فقط ولا تتمدد الصورة |
| بلا وميض | النسخة تُظلَّل تدريجيًا بنفس تدرّج الواجهة، فعند هبوطها تكون مطابقة للخلفية الجديدة تمامًا، ثم تُحذف |
| FLIP | تُقاس البطاقات قبل تغيير الترتيب وبعده، وتنزلق كل بطاقة من موضعها القديم إلى الجديد |
| الكلمات | العنوان القديم يختفي بسرعة، والجديد يصعد ويظهر أثناء التوسع |
| النقرات المتكررة | لا تبدأ حركة جديدة قبل انتهاء الحالية |
| الصور | تُحمّل كلها عند البداية. إن فشلت صورة يبقى تدرّج لوني بدل صفحة فارغة |

- يعمل بالفأرة، وبأسهم لوحة المفاتيح (تنعكس في RTL)، وبالسحب واللمس.
- **لوحة المفاتيح:** ترتيب التنقل بـ Tab يطابق ترتيب البطاقات على الشاشة، والتركيز يبقى في الصفحة بعد اختيار بطاقة.
- **الصور البطيئة:** الانتظار لا يتجاوز 1.5 ث، فلا تتجمد الصفحة.
- يحترم `prefers-reduced-motion`: نفس الخطوات بزمن صفر.
- لا طلبات شبكة خارجية، ولا تخزين، ولا خدمات حجز.

## الملفات

- `index.html`: الواجهة، والنص، وصف البطاقات، وأزرار التنقل
- `ar.html`: النسخة العربية RTL (مولّدة من `index.html`)
- `style.css`: الطبقات، والتخطيط للحاسوب والهاتف، والتظليل
- `main.js`: البيانات، والحالة، وهندسة الحركة، والتنقل
- `assets/images/`: الصور الأربع

## مصادر الصور وتراخيصها

الصور الأربع من Wikimedia Commons، وهي نسخ Commons نفسها بعرض 1920px، **بدون أي تعديل على الملفات**. الصفحة تعرضها فقط بقص `object-fit: cover`، وتظليل متدرج فوقها، وزوايا مدوّرة.

| الملف | العمل الأصلي | المصوّر | الترخيص |
|---|---|---|---|
| `dolomites.jpg` | [Odles da Secëda Gherdëina](https://commons.wikimedia.org/wiki/File:Odles_da_Sec%C3%ABda_Gherd%C3%ABina.jpg) | Wolfgang Moroder | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `kyoto.jpg` | [Yasaka-dori early morning with street lanterns and the Tower of Yasaka (Hokan-ji Temple), Kyoto, Japan](https://commons.wikimedia.org/wiki/File:Yasaka-dori_early_morning_with_street_lanterns_and_the_Tower_of_Yasaka_(Hokan-ji_Temple),_Kyoto,_Japan.jpg) | Basile Morin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `vestrahorn.jpg` | [Vestrahorn and Stokksnes beach in Iceland](https://commons.wikimedia.org/wiki/File:Vestrahorn_and_Stokksnes_beach_in_Iceland.jpg) | Daniel Oberhaus | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `wadi-rum.jpg` | [Wadi rum desert](https://commons.wikimedia.org/wiki/File:Wadi_rum_desert.jpg) | Peter Chisholm (مستخدم Commons ‏E.3) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

**ما تسمح به هذه التراخيص:**
- **CC BY-SA وCC BY:** النسخ وإعادة التوزيع (ومنها نشر الملفات كما هي في هذا المستودع) والاستخدام التجاري والتعديل مسموحة، بشرط ذكر اسم المصوّر وعنوان العمل ورابط الترخيص، وبيان أي تعديل.
- **CC BY-SA فقط:** إن عدّلت الصورة فانشر التعديل تحت نفس الترخيص (أو ترخيص متوافق).
- **CC0:** لا شروط. ذكر المصوّر مجاملة.
- صورة الدولوميت: يطلب المصوّر على صفحة الملف ذكره كمؤلف وإرسال رسالة له. هذا طلب منه وليس شرطًا في الترخيص.

**مهم:**
- تراخيص الصور منفصلة عن ترخيص الكود، **ولا يشملها ترخيص الكود**. نفس المعلومات موجودة في `CREDITS.txt` و`assets/images/CREDITS.txt`، فأبقِها مع الصور.
- الصفحة تعرض في الزاوية اسم مصوّر الصورة الحالية وترخيصها. لصورة وادي رم تعرض اسم حساب Commons ‏«E.3».

## ترخيص الكود

الكود الأصلي لهذه الحلقة (`index.html` و`ar.html` و`style.css` و`main.js`) مرخّص بترخيص **MIT**، مثل باقي المستودع (انظر [`LICENSE`](../LICENSE) في جذر المستودع).

**الترخيص لا يشمل:**
- الصور في `assets/images/`: لكل صورة ترخيصها المذكور أعلاه، وتبقى خاضعة له وحده.
- فيديوهات Design&Code، واسم Design&Code وشعارها وهويتها البصرية.

---

تابع **[@designcode_17](https://www.instagram.com/designcode_17/)** لريل جديد كل يوم 🎬
