$(function () {
  const $window = $(window);
  const $header = $('#siteHeader');
  const $navToggle = $('#navToggle');
  const $mainNav = $('#mainNav');
  const $modal = $('#projectModal');

  // إخفاء شاشة التحميل
  setTimeout(function () {
    $('#pageLoader').addClass('hidden');
  }, 450);

  // السنة الحالية
  $('#currentYear').text(new Date().getFullYear());

  // شريط التنقل عند التمرير
  function updateHeader() {
    $header.toggleClass('scrolled', $window.scrollTop() > 20);
  }
  updateHeader();
  $window.on('scroll', updateHeader);

  // قائمة الجوال
  $navToggle.on('click', function () {
    const isOpen = $mainNav.toggleClass('open').hasClass('open');
    $(this).toggleClass('active', isOpen).attr('aria-expanded', isOpen);
  });

  $('.main-nav a').on('click', function () {
    $mainNav.removeClass('open');
    $navToggle.removeClass('active').attr('aria-expanded', 'false');
  });

  // تفعيل رابط القسم الحالي
  const $sections = $('main section[id]');
  $window.on('scroll', function () {
    const scrollPosition = $window.scrollTop() + 140;
    $sections.each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      if (scrollPosition >= top && scrollPosition < bottom) {
        const id = $(this).attr('id');
        $('.main-nav a').removeClass('active');
        $('.main-nav a[href="#' + id + '"]').addClass('active');
      }
    });
  });

  // إظهار العناصر عند التمرير
  function revealElements() {
    const trigger = $window.scrollTop() + $window.height() * 0.88;
    $('.reveal:not(.visible)').each(function () {
      if ($(this).offset().top < trigger) {
        $(this).addClass('visible');
      }
    });
  }
  revealElements();
  $window.on('scroll resize', revealElements);

  // فلترة معرض الأعمال باستخدام jQuery
  $('.portfolio-filter button').on('click', function () {
    const filter = $(this).data('filter');
    $('.portfolio-filter button').removeClass('active');
    $(this).addClass('active');

    $('.portfolio-item').each(function () {
      const matches = filter === 'all' || $(this).data('category') === filter;
      if (matches) {
        $(this).removeClass('is-hidden').hide().fadeIn(280);
      } else {
        $(this).fadeOut(180, function () {
          $(this).addClass('is-hidden');
        });
      }
    });
  });

  // نافذة طلب المشروع
  function openModal() {
    $modal.addClass('active').attr('aria-hidden', 'false');
    $('body').addClass('modal-open');
    setTimeout(function () {
      $modal.find('input').first().trigger('focus');
    }, 250);
  }

  function closeModal() {
    $modal.removeClass('active').attr('aria-hidden', 'true');
    $('body').removeClass('modal-open');
  }

  $('.open-project-modal').on('click', openModal);
  $('.close-project-modal').on('click', closeModal);
  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  // نموذج التواصل التجريبي
  $('#contactForm').on('submit', function (event) {
    event.preventDefault();
    const $status = $('#contactStatus');
    const isValid = this.checkValidity();

    if (!isValid) {
      this.reportValidity();
      $status.addClass('error').text('يرجى تعبئة الحقول المطلوبة بصورة صحيحة.');
      return;
    }

    $status.removeClass('error').text('تم استلام رسالتك في النسخة التجريبية. اربط النموذج بخدمة بريد عند النشر.');
    this.reset();
  });

  // طلب المشروع عبر واتساب
  $('#projectForm').on('submit', function (event) {
    event.preventDefault();
    const $status = $('#projectStatus');

    if (!this.checkValidity()) {
      this.reportValidity();
      $status.addClass('error').text('يرجى تعبئة الحقول المطلوبة.');
      return;
    }

    const services = $('input[name="services"]:checked').map(function () {
      return this.value;
    }).get();

    if (!services.length) {
      $status.addClass('error').text('اختر خدمة واحدة على الأقل.');
      return;
    }

    const data = Object.fromEntries(new FormData(this).entries());
    const message = [
      'مرحبًا Code Rist، أود طلب مشروع جديد:',
      '',
      'الاسم: ' + data.clientName,
      'رقم الهاتف: ' + data.clientPhone,
      'البريد: ' + data.clientEmail,
      'المؤسسة: ' + (data.organization || 'غير محدد'),
      'الخدمات: ' + services.join('، '),
      'تفاصيل المشروع: ' + data.projectDetails
    ].join('\n');

    // غيّر الرقم التالي إلى رقم واتساب الشركة بدون + أو مسافات
    const whatsappNumber = '970590000000';
    const whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);

    $status.removeClass('error').text('سيتم فتح واتساب لإرسال الطلب.');
    window.open(whatsappUrl, '_blank', 'noopener');
  });
});
