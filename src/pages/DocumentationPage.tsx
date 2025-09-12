import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentationPage = () => {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // Create a simple HTML document for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>دليل لوحة التحكم الإدارية - تداول الذكي</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Noto Sans Arabic', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 40px;
              direction: rtl;
            }
            
            h1 {
              color: #8B5CF6;
              font-size: 2.5em;
              margin-bottom: 20px;
              text-align: center;
              border-bottom: 3px solid #8B5CF6;
              padding-bottom: 10px;
            }
            
            h2 {
              color: #6366f1;
              font-size: 1.8em;
              margin: 30px 0 15px 0;
              padding: 10px 0;
              border-bottom: 2px solid #e5e7eb;
            }
            
            h3 {
              color: #4f46e5;
              font-size: 1.4em;
              margin: 25px 0 10px 0;
            }
            
            h4 {
              color: #6366f1;
              font-size: 1.2em;
              margin: 20px 0 10px 0;
            }
            
            p {
              margin-bottom: 15px;
              text-align: justify;
            }
            
            ul, ol {
              margin: 15px 0;
              padding-right: 30px;
            }
            
            li {
              margin-bottom: 8px;
            }
            
            strong {
              color: #1f2937;
              font-weight: 600;
            }
            
            code {
              background: #f3f4f6;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              direction: ltr;
              display: inline-block;
            }
            
            .section {
              margin: 40px 0;
              page-break-inside: avoid;
            }
            
            .feature-box {
              background: #f8fafc;
              border: 2px solid #e5e7eb;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            
            .warning-box {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              padding: 15px;
              margin: 15px 0;
              border-radius: 6px;
            }
            
            .tip-box {
              background: #dcfce7;
              border: 2px solid #16a34a;
              padding: 15px;
              margin: 15px 0;
              border-radius: 6px;
            }
            
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
              h1 { page-break-after: avoid; }
              h2, h3 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>🚀 دليل لوحة التحكم الإدارية - تداول الذكي</h1>
          
          <div class="section">
            <h2>📋 المحتويات</h2>
            <ol>
              <li><a href="#overview">نظرة عامة</a></li>
              <li><a href="#access">الوصول إلى لوحة التحكم</a></li>
              <li><a href="#dashboard">الصفحة الرئيسية للوحة التحكم</a></li>
              <li><a href="#settings">إدارة الإعدادات</a></li>
              <li><a href="#users">إدارة المستخدمين</a></li>
              <li><a href="#subscriptions">إدارة الاشتراكات</a></li>
              <li><a href="#apis">إدارة APIs</a></li>
              <li><a href="#analytics">الإحصائيات والتقارير</a></li>
              <li><a href="#troubleshooting">استكشاف الأخطاء</a></li>
            </ol>
          </div>

          <div class="section" id="overview">
            <h2>🔍 نظرة عامة</h2>
            <p><strong>لوحة التحكم الإدارية</strong> هي منصة شاملة لإدارة موقع "تداول الذكي" وتسمح للمديرين المخولين بـ:</p>
            
            <div class="feature-box">
              <ul>
                <li><strong>التحكم في إعدادات الموقع</strong> العامة والأمنية</li>
                <li><strong>إدارة المستخدمين</strong> والصلاحيات</li>
                <li><strong>متابعة الاشتراكات</strong> والباقات</li>
                <li><strong>مراقبة الأداء</strong> والإحصائيات</li>
                <li><strong>إدارة APIs</strong> والمفاتيح الأمنية</li>
              </ul>
            </div>
          </div>

          <div class="section" id="access">
            <h2>🔐 الوصول إلى لوحة التحكم</h2>
            
            <h3>🌐 الرابط</h3>
            <p><code>https://your-domain.com/tadawladmin/login</code></p>
            
            <h3>📋 متطلبات الدخول</h3>
            <ul>
              <li><strong>اسم المستخدم الإداري</strong> المسجل في النظام</li>
              <li><strong>كلمة المرور</strong> الآمنة</li>
              <li><strong>صلاحيات المدير الفائق</strong> (Super Admin)</li>
            </ul>
            
            <h3>🚀 عملية تسجيل الدخول</h3>
            <ol>
              <li>انتقل إلى صفحة تسجيل دخول المدير</li>
              <li>أدخل بيانات الاعتماد الإدارية</li>
              <li>اضغط "تسجيل الدخول"</li>
              <li>ستتم إعادة توجيهك إلى لوحة التحكم الرئيسية</li>
            </ol>
          </div>

          <div class="section" id="dashboard">
            <h2>🏠 الصفحة الرئيسية للوحة التحكم</h2>
            
            <h3>🌍 عنوان URL</h3>
            <p><code>/tadawladmin/dashboard</code></p>
            
            <h3>🧩 المكونات الرئيسية</h3>
            
            <h4>1️⃣ شريط التنقل العلوي</h4>
            <ul>
              <li><strong>شعار المنصة</strong>: يربط بالصفحة الرئيسية</li>
              <li><strong>قائمة التنقل</strong>: تتضمن جميع الأقسام الإدارية</li>
              <li><strong>إعدادات المدير</strong>: الملف الشخصي وتسجيل الخروج</li>
            </ul>
            
            <h4>2️⃣ الشريط الجانبي</h4>
            <ul>
              <li><strong>الإحصائيات</strong> (📊)</li>
              <li><strong>المستخدمين</strong> (👥)</li>
              <li><strong>الاشتراكات</strong> (💳)</li>
              <li><strong>المشرفين</strong> (🛡️)</li>
              <li><strong>APIs</strong> (🔧)</li>
              <li><strong>الإعدادات</strong> (⚙️)</li>
            </ul>
            
            <h4>3️⃣ منطقة المحتوى الرئيسي</h4>
            <p>تعرض الإحصائيات والبيانات حسب القسم المحدد:</p>
            
            <div class="feature-box">
              <p><strong>بطاقات الإحصائيات السريعة:</strong></p>
              <ul>
                <li>إجمالي المستخدمين المسجلين</li>
                <li>إجمالي المعاملات المالية</li>
                <li>عدد قوائم المراقبة النشطة</li>
                <li>عدد المحافظ الاستثمارية</li>
                <li>عدد الأخبار المنشورة</li>
              </ul>
            </div>
          </div>

          <div class="section" id="settings">
            <h2>⚙️ إدارة الإعدادات</h2>
            
            <h3>🎯 الوصول</h3>
            <p><strong>المسار</strong>: لوحة التحكم → الإعدادات → إعدادات الموقع</p>
            
            <h3>📂 الأقسام المتاحة</h3>
            
            <h4>1. العلامة التجارية 🏷️</h4>
            
            <p><strong>إعدادات الهوية البصرية:</strong></p>
            <ul>
              <li><strong>اسم الموقع</strong>: النص الذي يظهر في عنوان المتصفح</li>
              <li><strong>أيقونة علامة التبويب (Favicon)</strong>:</li>
              <ul>
                <li>يمكن إدخال رابط URL للأيقونة</li>
                <li>أو رفع ملف مباشرة من الجهاز</li>
                <li>أنواع الملفات المدعومة: PNG, JPG, JPEG</li>
                <li>الحد الأقصى لحجم الملف: 2 ميجابايت</li>
                <li>الأبعاد المنصوح بها: 32x32 أو 16x16 بكسل</li>
              </ul>
            </ul>
            
            <div class="warning-box">
              <p><strong>ملاحظات مهمة:</strong></p>
              <ul>
                <li>ملفات ICO غير مدعومة حالياً</li>
                <li>التغييرات تظهر فوراً في علامة التبويب بعد الحفظ</li>
                <li>يتم حفظ الملفات المرفوعة في Supabase Storage</li>
              </ul>
            </div>
            
            <h4>2. الإعدادات العامة 🌐</h4>
            
            <p><strong>معلومات الموقع الأساسية:</strong></p>
            <ul>
              <li><strong>وصف الموقع</strong>: نص وصفي شامل للمنصة</li>
              <li><strong>البريد الإلكتروني للتواصل</strong>: للاستفسارات العامة</li>
            </ul>
            
            <h4>3. إعدادات الأمان 🛡️</h4>
            
            <p><strong>التحكم في الوصول والأمان:</strong></p>
            
            <p><strong>وضع الصيانة:</strong></p>
            <ul>
              <li>تفعيل/إلغاء وضع منع المستخدمين من الوصول</li>
              <li>المديرون يمكنهم الوصول دائماً حتى أثناء الصيانة</li>
            </ul>
            
            <p><strong>إدارة التسجيل:</strong></p>
            <ul>
              <li><strong>السماح بالتسجيل الجديد</strong>: تمكين/تعطيل تسجيل مستخدمين جدد</li>
              <li><strong>تفعيل البريد الإلكتروني مطلوب</strong>: إجبار تأكيد البريد الإلكتروني</li>
            </ul>
            
            <p><strong>حدود الاستخدام:</strong></p>
            <ul>
              <li><strong>الحد الأقصى للمستخدمين الجدد يومياً</strong>: للتحكم في معدل النمو</li>
              <li><strong>انتهاء الجلسة (ساعة)</strong>: مدة بقاء المستخدم متصلاً</li>
            </ul>
            
            <h4>4. إعدادات المظهر 🎨</h4>
            
            <p><strong>الألوان والتخصيص البصري:</strong></p>
            <ul>
              <li><strong>اللون الأساسي</strong>: يؤثر على العناصر الرئيسية في الموقع</li>
              <li><strong>اللون الثانوي</strong>: يؤثر على العناصر الفرعية</li>
              <li>يتم حفظ الألوان بصيغة Hex (مثل: #8B5CF6)</li>
            </ul>
            
            <h4>5. إعدادات تحسين محركات البحث (SEO) 🔍</h4>
            
            <p><strong>تحسين ظهور الموقع في محركات البحث:</strong></p>
            <ul>
              <li><strong>عنوان صفحة الموقع</strong>: يظهر في نتائج البحث وعلامة التبويب</li>
              <li><strong>وصف صفحة الموقع</strong>: الوصف الذي يظهر في نتائج البحث</li>
              <li><strong>الكلمات المفتاحية</strong>: كلمات مفصولة بفاصلة للبحث</li>
            </ul>
            
            <h4>6. إعدادات الإشعارات 📱</h4>
            
            <p><strong>التحكم في أنواع الإشعارات:</strong></p>
            <ul>
              <li><strong>الإشعارات عبر البريد الإلكتروني</strong>: تفعيل إرسال الرسائل</li>
              <li><strong>الإشعارات المدفوعة</strong>: إشعارات المتصفح الفورية</li>
              <li><strong>الإشعارات عبر الرسائل النصية</strong>: رسائل SMS</li>
            </ul>
            
            <h3>💾 عملية الحفظ</h3>
            
            <p><strong>خطوات حفظ الإعدادات:</strong></p>
            <ol>
              <li>قم بتعديل الإعدادات المطلوبة</li>
              <li>اضغط على زر "حفظ التغييرات" في الأعلى</li>
              <li>انتظر رسالة التأكيد الخضراء</li>
              <li>التغييرات تُطبق فوراً على الموقع</li>
            </ol>
            
            <div class="tip-box">
              <p><strong>معالجة الأخطاء:</strong></p>
              <ul>
                <li>في حالة فشل الحفظ، ستظهر رسالة خطأ باللون الأحمر</li>
                <li>تحقق من الاتصال بالإنترنت</li>
                <li>تأكد من صحة البيانات المدخلة</li>
                <li>في حالة استمرار المشكلة، تواصل مع الدعم التقني</li>
              </ul>
            </div>
          </div>

          <div class="section" id="users">
            <h2>👥 إدارة المستخدمين</h2>
            
            <h3>🎯 الوصول</h3>
            <p><strong>المسار</strong>: لوحة التحكم → المستخدمين</p>
            
            <h3>🛠️ إمكانيات الإدارة</h3>
            <ul>
              <li><strong>عرض قائمة المستخدمين</strong>: مع تفاصيل التسجيل والنشاط</li>
              <li><strong>البحث والتصفية</strong>: حسب الاسم، البريد، تاريخ التسجيل</li>
              <li><strong>إدارة الحالات</strong>: تفعيل/إلغاء تفعيل الحسابات</li>
              <li><strong>عرض الإحصائيات</strong>: عدد المستخدمين النشطين والجدد</li>
            </ul>
            
            <h3>📊 البيانات المعروضة</h3>
            <ul>
              <li><strong>الاسم الكامل</strong> و <strong>اسم المستخدم</strong></li>
              <li><strong>البريد الإلكتروني</strong> وحالة التفعيل</li>
              <li><strong>تاريخ التسجيل</strong> وآخر دخول</li>
              <li><strong>معلومات الملف الشخصي</strong> والصورة الرمزية</li>
            </ul>
          </div>

          <div class="section" id="subscriptions">
            <h2>💳 إدارة الاشتراكات</h2>
            
            <h3>🎯 الوصول</h3>
            <p><strong>المسار</strong>: لوحة التحكم → الاشتراكات</p>
            
            <h3>📦 إدارة الباقات</h3>
            
            <p><strong>عرض الباقات الحالية:</strong></p>
            <ul>
              <li><strong>الاسم</strong> باللغتين العربية والإنجليزية</li>
              <li><strong>السعر</strong> ومدة الاشتراك بالأشهر</li>
              <li><strong>المميزات</strong> المتاحة لكل باقة</li>
              <li><strong>حالة التفعيل</strong> وترتيب العرض</li>
            </ul>
            
            <p><strong>إضافة باقة جديدة:</strong></p>
            <ol>
              <li>تحديد اسم الباقة (عربي/إنجليزي)</li>
              <li>تحديد السعر ومدة الاشتراك</li>
              <li>إضافة قائمة المميزات</li>
              <li>تحديد إذا كانت الباقة "مميزة" أو "شائعة"</li>
              <li>ترتيب ظهور الباقة</li>
            </ol>
            
            <h3>📈 متابعة الاشتراكات النشطة</h3>
            
            <p><strong>إحصائيات الاشتراكات:</strong></p>
            <ul>
              <li>عدد الاشتراكات النشطة لكل باقة</li>
              <li>إجمالي الإيرادات الشهرية والسنوية</li>
              <li>معدلات التجديد والإلغاء</li>
              <li>توقعات النمو</li>
            </ul>
          </div>

          <div class="section" id="apis">
            <h2>🔧 إدارة APIs</h2>
            
            <h3>🎯 الوصول</h3>
            <p><strong>المسار</strong>: لوحة التحكم → APIs إدارة</p>
            
            <h3>🔑 إدارة المفاتيح</h3>
            
            <p><strong>إنشاء مفتاح API جديد:</strong></p>
            <ol>
              <li><strong>اسم المفتاح</strong>: وصف واضح للغرض</li>
              <li><strong>الوصف</strong>: تفاصيل الاستخدام المقصود</li>
              <li><strong>حدود الاستخدام</strong>: عدد الطلبات المسموح يومياً</li>
              <li><strong>الصلاحيات</strong>: نطاق الوصول المسموح</li>
            </ol>
            
            <p><strong>معلومات المفاتيح:</strong></p>
            <ul>
              <li><strong>قيمة المفتاح</strong>: النص الفريد للمصادقة</li>
              <li><strong>تاريخ الإنشاء</strong> وآخر استخدام</li>
              <li><strong>عدد الطلبات اليومية</strong> المستخدمة</li>
              <li><strong>الحالة</strong>: نشط/معطل/منتهي الصلاحية</li>
            </ul>
            
            <h3>📊 مراقبة الاستخدام</h3>
            
            <p><strong>إحصائيات الاستخدام:</strong></p>
            <ul>
              <li>عدد الطلبات لكل مفتاح</li>
              <li>أكثر APIs استخداماً</li>
              <li>معدلات النجاح والفشل</li>
              <li>تحليل أوقات الذروة</li>
            </ul>
          </div>

          <div class="section" id="analytics">
            <h2>📈 الإحصائيات والتقارير</h2>
            
            <h3>🏠 الصفحة الرئيسية للإحصائيات</h3>
            
            <p><strong>البطاقات السريعة:</strong></p>
            <ul>
              <li><strong>إجمالي المستخدمين</strong>: العدد الكلي للحسابات المسجلة</li>
              <li><strong>المعاملات</strong>: إجمالي قيمة وعدد المعاملات المالية</li>
              <li><strong>قوائم المراقبة</strong>: عدد القوائم النشطة</li>
              <li><strong>المحافظ الاستثمارية</strong>: عدد المحافظ المُنشأة</li>
              <li><strong>الأخبار</strong>: عدد المقالات المنشورة</li>
            </ul>
            
            <h3>📊 تقارير تفصيلية</h3>
            
            <p><strong>تقرير المستخدمين:</strong></p>
            <ul>
              <li>نمو قاعدة المستخدمين شهرياً</li>
              <li>معدلات النشاط والتفاعل</li>
              <li>التوزيع الجغرافي للمستخدمين</li>
              <li>أجهزة الوصول الأكثر استخداماً</li>
            </ul>
            
            <p><strong>تقرير المالي:</strong></p>
            <ul>
              <li>إيرادات الاشتراكات</li>
              <li>معدلات التحويل من المجاني إلى المدفوع</li>
              <li>متوسط قيمة الاشتراك لكل مستخدم</li>
              <li>توقعات الإيرادات</li>
            </ul>
            
            <p><strong>تقرير الأداء:</strong></p>
            <ul>
              <li>أوقات تحميل الصفحات</li>
              <li>معدلات الأخطاء والمشاكل التقنية</li>
              <li>استخدام قواعد البيانات والخوادم</li>
              <li>مؤشرات الأداء الرئيسية (KPIs)</li>
            </ul>
          </div>

          <div class="section" id="troubleshooting">
            <h2>🛠️ استكشاف الأخطاء</h2>
            
            <h3>⚠️ المشاكل الشائعة وحلولها</h3>
            
            <h4>1. لا يمكن حفظ الإعدادات</h4>
            
            <p><strong>الأسباب المحتملة:</strong></p>
            <ul>
              <li>مشكلة في الاتصال بقاعدة البيانات</li>
              <li>صلاحيات المدير غير كافية</li>
              <li>خطأ في تنسيق البيانات</li>
            </ul>
            
            <p><strong>الحلول:</strong></p>
            <ol>
              <li>تحقق من حالة الاتصال بالإنترنت</li>
              <li>قم بتسجيل الخروج والدخول مرة أخرى</li>
              <li>تحقق من صحة البيانات المدخلة</li>
              <li>جرب متصفح آخر أو امسح الذاكرة التخزينية</li>
            </ol>
            
            <h4>2. مشكلة في رفع الأيقونة</h4>
            
            <p><strong>الأسباب المحتملة:</strong></p>
            <ul>
              <li>حجم الملف كبير جداً (أكثر من 2MB)</li>
              <li>نوع ملف غير مدعوم</li>
              <li>مشكلة في التخزين السحابي</li>
            </ul>
            
            <p><strong>الحلول:</strong></p>
            <ol>
              <li>تأكد أن حجم الملف أقل من 2 ميجابايت</li>
              <li>استخدم ملفات PNG أو JPG فقط</li>
              <li>قم بضغط الصورة إذا كانت كبيرة</li>
              <li>جرب رفع الملف مرة أخرى</li>
            </ol>
            
            <h4>3. بطء في تحميل لوحة التحكم</h4>
            
            <p><strong>الأسباب المحتملة:</strong></p>
            <ul>
              <li>حمولة عالية على الخادم</li>
              <li>مشكلة في الشبكة</li>
              <li>كمية كبيرة من البيانات</li>
            </ul>
            
            <p><strong>الحلول:</strong></p>
            <ol>
              <li>أغلق علامات تبويب أخرى غير ضرورية</li>
              <li>امسح ذاكرة التخزين المؤقت للمتصفح</li>
              <li>تحقق من سرعة الإنترنت</li>
              <li>جرب الوصول في وقت مختلف</li>
            </ol>
            
            <h3>📞 معلومات الدعم التقني</h3>
            
            <p><strong>للحصول على المساعدة:</strong></p>
            <ul>
              <li><strong>البريد الإلكتروني</strong>: support@tadawlai.com</li>
              <li><strong>ساعات العمل</strong>: على مدار 24 ساعة، 7 أيام في الأسبوع</li>
              <li><strong>وقت الاستجابة</strong>: خلال 4 ساعات للمشاكل الطارئة</li>
            </ul>
            
            <div class="tip-box">
              <p><strong>عند التواصل مع الدعم، يرجى تضمين:</strong></p>
              <ul>
                <li>وصف تفصيلي للمشكلة</li>
                <li>خطوات إعادة تكرار المشكلة</li>
                <li>لقطة شاشة إذا كان ممكناً</li>
                <li>معلومات المتصفح ونظام التشغيل</li>
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>💡 نصائح للاستخدام الأمثل</h2>
            
            <h3>✅ أفضل الممارسات</h3>
            
            <h4>1️⃣ إدارة الإعدادات</h4>
            <ul>
              <li><strong>قم بعمل نسخة احتياطية</strong> من الإعدادات قبل التعديلات الكبيرة</li>
              <li><strong>اختبر التغييرات</strong> على بيئة اختبار أولاً إن أمكن</li>
              <li><strong>وثق التغييرات</strong> التي تقوم بها لسهولة المراجعة لاحقاً</li>
            </ul>
            
            <h4>2️⃣ إدارة المستخدمين</h4>
            <ul>
              <li><strong>راقب النمو</strong> في أعداد المستخدمين بانتظام</li>
              <li><strong>تفقد المستخدمين المعطلين</strong> دورياً وحدد سبب التعطيل</li>
              <li><strong>تابع شكاوى المستخدمين</strong> واستجب لها بسرعة</li>
            </ul>
            
            <h4>3️⃣ الأمان والحماية</h4>
            <ul>
              <li><strong>غير كلمة مرور المدير</strong> بانتظام (كل 3 أشهر)</li>
              <li><strong>راقب عمليات تسجيل الدخول المشبوهة</strong></li>
              <li><strong>فعل المصادقة الثنائية</strong> إذا كانت متاحة</li>
              <li><strong>تحقق من سجلات النشاط</strong> دورياً</li>
            </ul>
            
            <h4>4️⃣ الصيانة الدورية</h4>
            <ul>
              <li><strong>تحديث الإعدادات</strong> حسب متطلبات العمل</li>
              <li><strong>مراجعة الأداء</strong> والإحصائيات شهرياً</li>
              <li><strong>تنظيف البيانات القديمة</strong> عند الحاجة</li>
              <li><strong>اختبار النسخ الاحتياطية</strong> للتأكد من صحتها</li>
            </ul>
          </div>

          <div class="section">
            <h2>🎯 خاتمة</h2>
            
            <p>لوحة التحكم الإدارية لـ <strong>"تداول الذكي"</strong> هي أداة قوية وشاملة تمكن المديرين من إدارة جميع جوانب المنصة بكفاءة عالية. باستخدام هذا الدليل، ستتمكن من:</p>
            
            <div class="feature-box">
              <ul>
                <li><strong>إدارة الموقع بشكل احترافي</strong> من خلال الإعدادات المتنوعة</li>
                <li><strong>مراقبة الأداء</strong> باستخدام الإحصائيات المفصلة</li>
                <li><strong>ضمان الأمان</strong> من خلال إدارة المستخدمين والصلاحيات</li>
                <li><strong>تحسين تجربة المستخدم</strong> عبر التحكم في المحتوى والمظهر</li>
              </ul>
            </div>
            
            <div class="warning-box">
              <p><strong>تذكر دائماً:</strong></p>
              <ul>
                <li>النسخ الاحتياطي قبل التغييرات الكبيرة</li>
                <li>مراجعة الإعدادات بانتظام</li>
                <li>متابعة الإحصائيات لضمان الأداء الأمثل</li>
                <li>التواصل مع الدعم التقني عند الحاجة</li>
              </ul>
            </div>
            
            <hr style="margin: 40px 0; border: 1px solid #e5e7eb;">
            
            <p style="text-align: center; color: #6b7280; font-style: italic;">
              <strong>آخر تحديث:</strong> ديسمبر 2024<br>
              <strong>إعداد:</strong> فريق تطوير تداول الذكي
            </p>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait a moment for content to load, then trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  };

  const handleViewOnline = () => {
    window.open('/docs/admin-dashboard-guide.md', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tadawladmin/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة للوحة التحكم
              </Button>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewOnline}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                عرض اونلاين
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="gradient-bg flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                تحميل PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass border-primary/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl gradient-text">
                دليل لوحة التحكم الإدارية
              </CardTitle>
              <CardDescription className="text-lg">
                دليل شامل لاستخدام وإدارة لوحة التحكم لمنصة تداول الذكي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    📋 محتويات الدليل
                  </h3>
                  <ul className="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1">
                    <li>• نظرة عامة على لوحة التحكم</li>
                    <li>• طرق الوصول وتسجيل الدخول</li>
                    <li>• شرح جميع الأقسام والميزات</li>
                    <li>• إدارة الإعدادات والمستخدمين</li>
                    <li>• الإحصائيات والتقارير</li>
                    <li>• استكشاف الأخطاء والحلول</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                    ✨ مميزات الدليل
                  </h3>
                  <ul className="text-sm text-green-600/80 dark:text-green-400/80 space-y-1">
                    <li>• شرح مفصل لكل ميزة</li>
                    <li>• خطوات عملية واضحة</li>
                    <li>• نصائح وأفضل الممارسات</li>
                    <li>• حلول للمشاكل الشائعة</li>
                    <li>• معلومات الدعم التقني</li>
                    <li>• تحديث مستمر مع التطوير</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <h3 className="font-semibold text-lg mb-4 text-center">
                  🚀 ابدأ في استخدام لوحة التحكم الآن
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownloadPDF}
                    className="gradient-bg flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تحميل الدليل كـ PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewOnline}
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    قراءة الدليل اونلاين
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  هذا الدليل يحتوي على جميع المعلومات اللازمة لاستخدام لوحة التحكم بكفاءة عالية
                </p>
                <p className="mt-1">
                  في حالة وجود أي استفسارات، يمكن التواصل مع الدعم التقني
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;