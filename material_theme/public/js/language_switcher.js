frappe.provide("material_theme");

$(document).ready(function () {
  // wait for the navbar to render
  let checkNavbar = setInterval(() => {
    if ($(".navbar-collapse").length > 0) {
      clearInterval(checkNavbar);
      material_theme.setup_language_switcher();
    }
  }, 500);
});

material_theme.setup_language_switcher = function () {
  // prevent duplicate rendering
  if ($("#custom-lang-switch").length > 0) return;

  // Determine current language
  let current_lang = frappe.boot.lang;
  let is_arabic = current_lang === "ar";

  // HTML for the Switcher
  let switcher_html = `
        <li class="nav-item" id="custom-lang-switch">
            <div class="lang-toggle-container" title="Switch Language / تغيير اللغة">
                <span class="lang-label ${
                  !is_arabic ? "active" : ""
                }" data-lang="en">EN</span>
                <div class="lang-toggle-pill ${
                  is_arabic ? "active-ar" : ""
                }"></div>
                <span class="lang-label ${
                  is_arabic ? "active" : ""
                }" data-lang="ar">ع</span>
            </div>
        </li>
    `;

  $(".navbar-collapse .navbar-nav").last().prepend(switcher_html);

  // Click Event
  $("#custom-lang-switch .lang-toggle-container").on("click", function () {
    let new_lang = is_arabic ? "en" : "ar";

    // Visual Feedback immediately
    $(this).find(".lang-toggle-pill").toggleClass("active-ar");

    // call frappe API to set user lang
    frappe.call({
      method: "frappe.client.set_value",
      args: {
        doctype: "User",
        name: frappe.session.user,
        fieldname: "language",
        value: new_lang,
      },
      freeze: true,
      freeze_message: is_arabic
        ? "Switching to English..."
        : "جاري التحويل للعربية...",
      callback: function (r) {
        if (!r.exc) {
          window.location.reload();
        }
      },
    });
  });
};
