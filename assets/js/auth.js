function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
 
function avatarUrl(user) {
  return user?.profileImage ||
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(user?.name || "User");
}

function loadProfileMini() {
  const user = getUser();
  const dropdown = document.getElementById("profileDropdown");
  const navImg = document.getElementById("navbarProfileImage");

  if (navImg) {
    navImg.src =
      user?.profileImage ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}`;
  }

  if (!dropdown) return;

  dropdown.innerHTML = `
    <div style="text-align:center; padding:10px;">
      <img
        src="${
          user?.profileImage ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
          )}`
        }"
        style="
          width:70px;
          height:70px;
          border-radius:50%;
          object-fit:cover;
          border:2px solid #2563eb;
          margin-bottom:10px;
        "
      >

      <h3 style="margin:8px 0;color:#1e293b;font-size:18px;">
        ${user?.name || user?.email || "Guest User"}
      </h3>

      <p style="color:#64748b;margin:0;">
        📱 ${user?.phone || "Not Added"}
      </p>
    </div>

    <hr>

    <a href="#" onclick="openProfile()">👤 My Profile</a>
    <a href="#" onclick="openSettings()">⚙️ Settings</a>
    <a href="#" onclick="openNotifications()">🔔 Notifications</a>
    <a href="#" onclick="logoutUser()">🚪 Logout</a>
  `;
}

function toggleProfileMenu(event) {
  if (event) {
    event.stopPropagation();
  }

  const menu = document.getElementById("profileDropdown");
  if (!menu) return;

  loadProfileMini();

  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}


// Page par kahi bhi click karne par profile dropdown band ho jayega
document.addEventListener("click", function (event) {
  const menu = document.getElementById("profileDropdown");
  const profileBtn = document.getElementById("navbarProfileImage");

  if (!menu || !profileBtn) return;

  const clickedInsideMenu = menu.contains(event.target);
  const clickedOnProfile = profileBtn.contains(event.target);

  if (!clickedInsideMenu && !clickedOnProfile) {
    menu.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  loadProfileMini();
  applySavedSettings();
});

function openProfile() {
  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("profileNameInput").value = user.name || "";
  document.getElementById("profileEmailInput").value = user.email || "";
  document.getElementById("profilePhoneInput").value = user.phone || "";
  document.getElementById("profileLocationInput").value =
    user.location || "India";

  const preview = document.getElementById("profilePreview");
  if (preview) preview.src = avatarUrl(user);

  const msg = document.getElementById("profileSuccessMsg");
  if (msg) {
    msg.innerHTML = "";
    msg.style.display = "none";
  }

  document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
  const modal = document.getElementById("profileModal");

  if (modal) {
    modal.style.display = "none";
  }
}

function closeProfile() {
  document.getElementById("profileModal").style.display = "none";
}
function openProfile() {
  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("profileNameInput").value = user.name || "";
  document.getElementById("profileEmailInput").value = user.email || "";
  document.getElementById("profilePhoneInput").value = user.phone || "";
  document.getElementById("profileLocationInput").value =
    user.location || "India";

  const preview = document.getElementById("profilePreview");
  if (preview) preview.src = avatarUrl(user);

  const msg = document.getElementById("profileSuccessMsg");
  if (msg) {
    msg.innerHTML = "";
    msg.style.display = "none";
  }

  document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
  const modal = document.getElementById("profileModal");

  if (modal) {
    modal.style.display = "none";
  }
}
async function uploadProfileImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:5000/api/upload/profile-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Upload Response:", data);

    if (!response.ok) {
      alert(data.message || "Image upload failed!");
      return;
    }

    const imageUrl = data.imageUrl || data.url || "";

    if (!imageUrl) {
      alert("Image URL not received from server!");
      return;
    }

    user.profileImage = imageUrl;
    localStorage.setItem("user", JSON.stringify(user));

    await fetch("http://localhost:5000/api/auth/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: user.id,
    name: user.name,
    email: user.email || "",
    location: user.location || "India",
    profileImage: imageUrl,
  }),
});

    const preview = document.getElementById("profilePreview");
    if (preview) preview.src = imageUrl;

    loadProfileMini();
    alert("Profile image uploaded successfully!");
  }  catch (error) {
  console.error("Upload Error:", error);
  alert("Image upload failed! Check Console.");
}
}


// ================= PROFILE =================

function openProfile() {
  const user = getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("profileNameInput").value = user.name || "";
  document.getElementById("profileEmailInput").value = user.email || "";
  document.getElementById("profilePhoneInput").value = user.phone || "";
  document.getElementById("profileLocationInput").value =
    user.location || "India";

  const preview = document.getElementById("profilePreview");

  if (preview) {
    preview.src = avatarUrl(user);
  }

  const msg = document.getElementById("profileMessage");
  if (msg) {
    msg.innerHTML = "";
  }

  document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
  document.getElementById("profileModal").style.display = "none";
}

async function saveProfile() {
  const user = getUser();
  const msg = document.getElementById("profileMessage");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const updatedProfile = {
    userId: user.id,
    name: document.getElementById("profileNameInput").value,
    email: document.getElementById("profileEmailInput").value,
    phone: document.getElementById("profilePhoneInput").value,
    location: document.getElementById("profileLocationInput").value,
    profileImage: user.profileImage || "",
  };

  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user || updatedProfile)
      );

      loadProfileMini();

      if (msg) {
        msg.style.color = "#16a34a";
        msg.innerHTML = "✅ Profile updated successfully";
      }

      setTimeout(() => {
        closeProfile();
      }, 400);
    } else {
      if (msg) {
        msg.style.color = "#dc2626";
        msg.innerHTML =
          data.message || "❌ Profile update failed";
      }
    }
  } catch (error) {
    console.error(error);

    if (msg) {
      msg.style.color = "#dc2626";
      msg.innerHTML = "❌ Server Error";
    }
  }
}


// ================= SETTINGS =================

function openSettings() {
  const settings = JSON.parse(localStorage.getItem("settings")) || {
    theme: "light",
    language: "en",
    notifications: true,
  };

  const company = JSON.parse(localStorage.getItem("company")) || {};

  // Safe checks
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.value = settings.theme || "light";
  }

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.value = settings.language || "en";
  }

  const notificationToggle = document.getElementById("notificationToggle");
  if (notificationToggle) {
    notificationToggle.checked = settings.notifications ?? true;
  }

  const companyNameInput = document.getElementById("companyNameInput");
  if (companyNameInput) {
    companyNameInput.value = company.name || "";
  }

  const companyGSTInput = document.getElementById("companyGSTInput");
  if (companyGSTInput) {
    companyGSTInput.value = company.gst || "";
  }

  const companyPhoneInput = document.getElementById("companyPhoneInput");
  if (companyPhoneInput) {
    companyPhoneInput.value = company.phone || "";
  }

  const companyAddressInput = document.getElementById("companyAddressInput");
  if (companyAddressInput) {
    companyAddressInput.value = company.address || "";
  }

  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.style.display = "flex";
  }
}

async function openNotifications() {
  const modal = document.getElementById("notificationsModal");
  const list = document.getElementById("notificationsList");

  let notifications = JSON.parse(localStorage.getItem("notifications")) || [
    {
      title: "Welcome",
      message: "Welcome back to Ambika Billing System.",
    },
    {
      title: "Reminder",
      message: "Export your data regularly to keep your backups safe.",
    },
    {
      title: "Today",
      message: "Check your sales and purchase summaries for the latest trend.",
    },
  ];

  try {
    const response = await fetch("http://localhost:5000/api/products");
    if (response.ok) {
      const products = await response.json();
      const lowStockProducts = products.filter((p) => Number(p.stock) < 5);

      lowStockProducts.forEach((product) => {
        notifications.unshift({
          title: "⚠️ Low Stock Alert",
          message: `${product.name} has only ${product.stock} units left.`,
        });
      });
    }
  } catch (error) {
    console.warn("Could not load inventory for notifications:", error);
  }

  if (list) {
    list.innerHTML = notifications.length
      ? notifications
          .map(
            (n) => `
              <div style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
                <strong>${n.title}</strong>
                <p style="margin:4px 0 0; color:#475569;">${n.message}</p>
              </div>
            `
          )
          .join("")
      : '<p style="color:#64748b;">No notifications right now.</p>';
  }

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeSettings() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function closeNotifications() {
  const modal = document.getElementById("notificationsModal");
  if (modal) {
    modal.style.display = "none";
  }
}

 
// MOBILE MENU 

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("show-menu");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.remove("show-menu");
}

document.addEventListener("click", function (e) {
  const menu = document.getElementById("mobileMenu");
  const button = document.querySelector(".menu-toggle");

  if (!menu || !button) return;

  if (
    menu.classList.contains("show-menu") &&
    !menu.contains(e.target) &&
    !button.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("mobileMenu");
  if (!menu) return;

  let startX = 0;

  menu.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].screenX;
  });

  menu.addEventListener("touchend", function (e) {
    const endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) closeMobileMenu();
  });
});

function saveSettings() {
  const msg = document.getElementById("settingsMessage");

  const settings = {
    theme: document.getElementById("themeSelect").value,
    language: document.getElementById("languageSelect").value,
    notifications: document.getElementById("notificationToggle").checked,
  };

  const company = {
    name: document.getElementById("companyNameInput").value,
    gst: document.getElementById("companyGSTInput").value,
    phone: document.getElementById("companyPhoneInput").value,
    address: document.getElementById("companyAddressInput").value,
  };

  // Save data
  localStorage.setItem("settings", JSON.stringify(settings));
  localStorage.setItem("company", JSON.stringify(company));

  // Apply settings instantly
  applySavedSettings();

  // Show success message
  if (msg) {
    msg.style.display = "block";
    msg.style.color = "#16a34a";
    msg.innerHTML = "✅ Settings saved successfully";
  }

  // Auto close after 1.5 seconds
  setTimeout(() => {
    if (msg) {
      msg.style.display = "none";
      msg.innerHTML = "";
    }

    closeSettings();
  }, 400);
}

async function clearAllData() {
  if (confirm("Are you sure? All data will be deleted except company details.")) {
    const preservedCompany = localStorage.getItem("company");
    const preservedSettings = localStorage.getItem("settings");
    const preservedUser = localStorage.getItem("user");
    const preservedToken = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/api/dashboard/reset", {
        method: "DELETE",
      });
    } catch (error) {
      console.warn("Could not reset server data:", error);
    }

    localStorage.clear();

    if (preservedCompany) localStorage.setItem("company", preservedCompany);
    if (preservedSettings) localStorage.setItem("settings", preservedSettings);
    if (preservedUser) localStorage.setItem("user", preservedUser);
    if (preservedToken) localStorage.setItem("token", preservedToken);

    window.location.href = "login.html";
  }
}
function applySavedSettings() {
  const settings =
    JSON.parse(localStorage.getItem("settings")) || {};

  const company =
    JSON.parse(localStorage.getItem("company")) || {};

  // Theme
  if (settings.theme) {
    document.body.setAttribute("data-theme", settings.theme);

    const themeSelect = document.getElementById("themeSelect");
    if (themeSelect) {
      themeSelect.value = settings.theme;
    }
  }

  // Language
  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect && settings.language) {
    languageSelect.value = settings.language;
  }

  // Notifications
  const notificationToggle =
    document.getElementById("notificationToggle");

  if (notificationToggle) {
    notificationToggle.checked =
      settings.notifications || false;
  }

  // Company Info
  const companyNameInput =
    document.getElementById("companyNameInput");

  const companyGSTInput =
    document.getElementById("companyGSTInput");

  const companyPhoneInput =
    document.getElementById("companyPhoneInput");

  const companyAddressInput =
    document.getElementById("companyAddressInput");

  if (companyNameInput)
    companyNameInput.value = company.name || "";

  if (companyGSTInput)
    companyGSTInput.value = company.gst || "";

  if (companyPhoneInput)
    companyPhoneInput.value = company.phone || "";

  if (companyAddressInput)
    companyAddressInput.value = company.address || "";
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profileDropdown");
  const profileImg = document.getElementById("navbarProfileImage");

  if (!dropdown || !profileImg) return;

  const clickedInsideDropdown = dropdown.contains(event.target);
  const clickedProfileImg = profileImg.contains(event.target);

  if (!clickedInsideDropdown && !clickedProfileImg) {
    dropdown.style.display = "none";
  }
});