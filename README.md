# Terme — Personal Productivity Dashboard

A personal dashboard for tracking notes, project tasks, and focus time — built
so that **every number on screen reflects a real action you took**, not sample
or placeholder data. Nothing is pre-filled; the dashboard starts empty and
fills up as you actually use it.

**Live demo:** _add your deployed link here_
**Tech stack:** React · Redux Toolkit · Tailwind CSS · Supabase · Recharts · Vite · PWA

## Features
- 🌐 Full English/Persian (RTL) language toggle
- 🌓 Dark/light theme, switchable, no page reload needed
- ⏱️ Pomodoro-style focus timer with a duration you set yourself
- 📊 Weekly focus + notes charts that turn red/green based on real day-over-day trend
- 📝 Freeform notes and tasks — nothing preset, everything user-added
- 😊 Offline sentiment analysis on notes (no API needed)
- 🔐 Optional real authentication + cloud sync via Supabase (falls back to local-only mode if not configured)
- 🤖 Built-in AI assistant chat (Groq · Llama 3 and DeepSeek via OpenRouter — both free tiers)
- 📱 Installable as a PWA
- 🔒 "Study Guard" — a simulated UX prototype for a focus-mode/auto-reply concept (clearly labeled as a prototype, not a real SMS integration)

## Technical decisions
- **Redux Toolkit over Context** — the app has several pieces of state (notes,
  tasks, weekly stats) consumed across many components; Redux keeps that
  predictable as the app grows.
- **CSS variables for theming** — dark/light mode is a single attribute swap on
  `<html>`, not duplicated Tailwind classes per component.
- **Graceful fallback for Supabase/AI** — the app detects missing API keys and
  degrades to local-only mode instead of crashing, so it's easy to run out of
  the box and easy to upgrade later.

---


---

## راه‌اندازی بک‌اند واقعی (Supabase) — اختیاری ولی پیشنهادی

اگه این کارو نکنی، اپ همچنان کار می‌کنه (حالت لوکال)، ولی نوت‌هات فقط روی همون مرورگر می‌مونن و لاگین واقعی نیست.

### قدم ۱: ساخت پروژه
1. برو به [supabase.com](https://supabase.com) و یه حساب رایگان بساز
2. یه پروژه جدید بساز (چند دقیقه طول می‌کشه تا آماده بشه)

### قدم ۲: ساخت جدول نوت‌ها
توی داشبورد Supabase برو به **SQL Editor** و این کوئری رو اجرا کن:

```sql
create table notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  text text not null,
  done boolean default false,
  created_at timestamptz default now()
);

alter table notes enable row level security;

create policy "Users can manage their own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### قدم ۳: گرفتن کلیدها
1. توی داشبورد Supabase برو به **Project Settings → API**
2. مقدار **Project URL** و **anon public key** رو کپی کن

### قدم ۴: وصل کردنشون به پروژه
1. توی پوشه‌ی پروژه، فایل `.env.example` رو کپی کن و اسمش رو بذار `.env`
2. مقادیر رو پر کن:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```
3. اپ رو دوباره اجرا کن: `npm run dev`

از این به بعد، لاگین واقعی (با رمز) و ذخیره‌سازی واقعی نوت‌ها فعاله.

---

## جایگزینی تحلیل احساسات با یه API واقعی (اختیاری)

فایل `src/lib/sentiment.js` الان یه تابع ساده‌ی کلمه‌محوره. اگه بخوای یه مدل واقعی NLP جایگزینش کنی:
1. یه حساب رایگان توی [huggingface.co](https://huggingface.co) بساز و یه Access Token بگیر
2. تابع `analyzeSentiment` رو به یه فراخوانی `fetch` به Inference API تبدیل کن (مستندات: https://huggingface.co/docs/api-inference)
3. چون این تابع الان async نیست، باید `NotesList.jsx` رو طوری تغییر بدی که نتیجه رو با `useEffect` یا در لحظه‌ی اضافه‌کردن نوت بگیره و ذخیره کنه

اگه خواستی، بعداً می‌تونیم این بخشو هم با هم پیاده کنیم.

---

## دیپلوی روی اینترنت (رایگان، با Vercel)

1. یه حساب رایگان توی [vercel.com](https://vercel.com) بساز (میشه با گیت‌هاب واردش شد)
2. پروژه رو به یه ریپوی GitHub پوش کن (مستندات کامل گیت‌هاب رو در پیام بعدی برات آماده می‌کنم)
3. توی Vercel: **New Project → Import** ریپو رو انتخاب کن
4. اگه از Supabase یا AI استفاده می‌کنی، توی تنظیمات پروژه‌ی Vercel، بخش **Environment Variables** رو باز کن و متغیرهای لازم رو اضافه کن
5. دکمه‌ی **Deploy** رو بزن — چند دقیقه بعد یه لینک زنده داری (مثل `terme-dashboard.vercel.app`)

---

## ویژگی‌های نسخه ۳ (جدید)

### 🤖 دستیار هوش مصنوعی (رایگان، واقعی)
دو تا دستیار هوش مصنوعی واقعی که می‌تونی باهاشون چت کنی. **صادقانه بگم:** این‌ها خود ChatGPT یا DeepSeek رسمی نیستن (OpenAI هیچ نسخه‌ی رایگان دائمی نداره)، بلکه دو تا سرویس واقعاً رایگانه که بدون کارت اعتباری کار می‌کنن:
- **دستیار ۱** از [Groq](https://console.groq.com/keys) استفاده می‌کنه (مدل Llama 3، خیلی سریع)
- **دستیار ۲** از [OpenRouter](https://openrouter.ai/keys) استفاده می‌کنه (مدل رایگان DeepSeek)

**راه‌اندازی:**
1. توی هر دو سایت بالا یه حساب رایگان بساز و یه API Key بگیر
2. توی فایل `.env` (که برای Supabase ساختی) این دو خط رو هم اضافه کن:
```
VITE_GROQ_API_KEY=gsk_xxxxx
VITE_OPENROUTER_API_KEY=sk-or-xxxxx
```
3. `npm run dev` رو دوباره اجرا کن

اگه این کلیدها رو نذاری، دستیارها یه پیام میدن که "هنوز وصل نشده" — اپ خراب نمیشه.

### 🔒 محافظ مطالعه (Study Guard) — شبیه‌سازی‌شده
این بخش **ایده‌ی اصلی تو** (اتصال به پیامک واقعی + مسدودسازی اینترنت) رو به‌صورت یه دموی UI/UX نشون میده، بدون این‌که واقعاً به شبکه‌ی مخابراتی یا سیستم‌عامل وصل بشه (که همون‌طور که گفتیم، از طریق یه سایت وب فنی/امنیتی ممکن نیست).

چطور کار می‌کنه:
- تا ۲ مخاطب اضافه می‌کنی (فقط اسم و شماره‌ی نمایشی)
- «حالت مطالعه» رو با یه مدت زمان مشخص فعال می‌کنی
- نوت‌ها و وظایف داشبورد قفل میشن (شبیه‌سازی قفل بودن گوشی)
- با دکمه‌ی «وانمود کن پیام داد» می‌تونی تست کنی که بعد از ۵ پیام، پیام خودکار «در حال مطالعه‌ام» نمایش داده میشه

**نکته برای مصاحبه/رزومه:** می‌تونی دقیقاً همین جمله رو بگی: *"این یه پروتوتایپ UX از ایده‌مه؛ نسخه‌ی تولیدی واقعیش نیاز به یه SMS Gateway (مثل Kavenegar) و مجوزهای سیستم‌عامل داره که معماریش رو طراحی کردم اما به‌خاطر هزینه پیاده‌سازی نکردم."*




## تکنولوژی‌ها
- React 18 + Vite
- Redux Toolkit (مدیریت state عادت‌ها و وظایف)
- Tailwind CSS (استایل‌دهی)
- Recharts (نمودارها)

## پیش‌نیاز
باید **Node.js نسخه ۱۸ یا بالاتر** روی سیستمت نصب باشه.
برای چک کردن نسخه، این دستور رو در ترمینال بزن:

```
node -v
```

اگه نصب نیست، از سایت رسمی نصبش کن: https://nodejs.org (نسخه LTS رو دانلود کن)

## نحوه اجرا — قدم به قدم

### ۱. فایل‌ها رو از حالت زیپ خارج کن
فایل `terme-dashboard.zip` رو در جایی که می‌خوای پروژه باشه اکسترکت کن.

### ۲. وارد پوشه پروژه شو
```
cd terme-dashboard
```

### ۳. پکیج‌ها رو نصب کن
```
npm install
```
این دستور همه‌ی وابستگی‌ها (React، Redux، Tailwind، Recharts) رو از روی فایل `package.json` نصب می‌کنه. چند دقیقه طول می‌کشه.

### ۴. پروژه رو اجرا کن
```
npm run dev
```
بعد از اجرای این دستور، در ترمینال یه آدرس مثل این می‌بینی:
```
Local: http://localhost:5173/
```
اون آدرس رو در مرورگر باز کن (یا معمولاً خودش باز میشه) — داشبورد رو می‌بینی.

### ۵. برای توقف
در ترمینال `Ctrl + C` رو بزن.

## ساختار پروژه
```
terme-dashboard/
├── index.html              # نقطه ورود HTML
├── src/
│   ├── main.jsx             # نقطه ورود React
│   ├── App.jsx               # چیدمان اصلی داشبورد
│   ├── store.js              # پیکربندی Redux store
│   ├── index.css             # استایل پایه + Tailwind
│   ├── features/
│   │   └── dashboard/
│   │       └── dashboardSlice.js   # state عادت‌ها، وظایف، نمودارها
│   └── components/
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── StatusTicker.jsx  # نوار وضعیت زنده (المان شاخص طراحی)
│       ├── StatCard.jsx
│       ├── HabitList.jsx
│       ├── TaskList.jsx
│       ├── ActivityChart.jsx     # نمودار ساعت فوکوس هفتگی
│       └── HabitBarChart.jsx     # نمودار عادت‌های تکمیل‌شده
├── tailwind.config.js       # پالت رنگ و تایپوگرافی سفارشی
├── vite.config.js
└── package.json
```

## چطور داده‌های خودت رو جایگزین کنی
داده‌های نمونه (عادت‌ها، وظایف، فعالیت هفتگی) در فایل زیر هستن:
```
src/features/dashboard/dashboardSlice.js
```
کافیه مقادیر `habits`، `tasks` و `weeklyActivity` رو با اطلاعات واقعی خودت جایگزین کنی.

## آماده‌سازی برای دیپلوی (اختیاری)
وقتی خواستی روی هاست رایگان (مثل Netlify یا Vercel) بذاریش:
```
npm run build
```
یه پوشه `dist` می‌سازه که شامل نسخه‌ی نهایی و بهینه‌شده‌ی سایته. همون پوشه رو آپلود کن.
