module.exports = {
  "account/profile": function (locals, escapeFn, include, rethrow) {
var displayName = locals.displayName, settings = locals.settings, initials = locals.initials, account = locals.account, canEditSelf = locals.canEditSelf, accessibleCities = locals.accessibleCities, employeeProfile = locals.employeeProfile, recommendations = locals.recommendations, formatDate = locals.formatDate, discussionPosts = locals.discussionPosts;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( displayName ))
    ; __append(" - Staff Account</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container account-profile-view\">\r\n    <section class=\"account-profile-hero\">\r\n      <div class=\"account-profile-card-head\">\r\n        <div class=\"account-profile-avatar\">\r\n          ")
    ;  if (settings.avatar_url) { 
    ; __append("\r\n            <img src=\"")
    ; __append(escapeFn( settings.avatar_url ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( displayName ))
    ; __append(" avatar\">\r\n          ")
    ;  } else { 
    ; __append("\r\n            <span>")
    ; __append(escapeFn( initials ))
    ; __append("</span>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n        <div>\r\n          <h1>")
    ; __append(escapeFn( displayName ))
    ; __append("</h1>\r\n          <p class=\"account-profile-subtitle\">")
    ; __append(escapeFn( account.email ))
    ; __append("</p>\r\n          <div class=\"account-city-list\">\r\n            <span class=\"badge-status badge-")
    ; __append(escapeFn( account.role ))
    ; __append("\">")
    ; __append(escapeFn( account.role ))
    ; __append("</span>\r\n            ")
    ;  if (canEditSelf) { 
    ; __append("\r\n              <span class=\"badge-status badge-city-soft\">Your Account</span>\r\n            ")
    ;  } 
    ; __append("\r\n            ")
    ;  accessibleCities.forEach((cityName) => { 
    ; __append("\r\n              <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( cityName ))
    ; __append("</span>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"account-profile-actions\">\r\n        <a href=\"/account/team\" class=\"btn btn-secondary\">Back to Team Directory</a>\r\n        ")
    ;  if (canEditSelf) { 
    ; __append("\r\n          <a href=\"/account/settings\" class=\"btn btn-primary\">Edit My Settings</a>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"account-profile-grid\">\r\n      <article class=\"account-profile-card\">\r\n        <h2>About</h2>\r\n        <p class=\"account-profile-bio\">")
    ; __append(escapeFn( settings.bio || 'No bio has been added for this staff account yet.' ))
    ; __append("</p>\r\n      </article>\r\n\r\n      <article class=\"account-profile-card\">\r\n        <h2>Quick Info</h2>\r\n        <div class=\"account-profile-summary\">\r\n          <div>\r\n            <span>Department</span>\r\n            <strong>")
    ; __append(escapeFn( employeeProfile.department || 'Not assigned' ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Title</span>\r\n            <strong>")
    ; __append(escapeFn( employeeProfile.title || 'Not assigned' ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Language</span>\r\n            <strong>")
    ; __append(escapeFn( settings.language ? settings.language.toUpperCase() : 'EN' ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Visibility</span>\r\n            <strong>")
    ; __append(escapeFn( settings.profile_visibility ))
    ; __append("</strong>\r\n          </div>\r\n        </div>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"account-profile-grid\">\r\n      <article class=\"account-profile-card\">\r\n        <h2>Account Details</h2>\r\n        <div class=\"account-profile-meta\">\r\n          <div>\r\n            <span>Username</span>\r\n            <strong>")
    ; __append(escapeFn( account.username ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Member Since</span>\r\n            <strong>")
    ; __append(escapeFn( new Date(account.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Primary City</span>\r\n            <strong>")
    ; __append(escapeFn( employeeProfile.primary_city || settings.home_city || 'DALLAS' ))
    ; __append("</strong>\r\n          </div>\r\n          <div>\r\n            <span>Hire Date</span>\r\n            <strong>")
    ; __append(escapeFn( employeeProfile.hire_date ? new Date(employeeProfile.hire_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not recorded' ))
    ; __append("</strong>\r\n          </div>\r\n        </div>\r\n      </article>\r\n\r\n      <article class=\"account-profile-card\">\r\n        <h2>Workspace Scope</h2>\r\n        <div class=\"account-profile-meta\">\r\n          <div>\r\n            <span>Accessible Cities</span>\r\n            <div class=\"account-city-list\">\r\n              ")
    ;  accessibleCities.forEach((cityName) => { 
    ; __append("\r\n                <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( cityName ))
    ; __append("</span>\r\n              ")
    ;  }) 
    ; __append("\r\n            </div>\r\n          </div>\r\n          <div>\r\n            <span>Contact</span>\r\n            <strong>")
    ; __append(escapeFn( account.email ))
    ; __append("</strong>\r\n          </div>\r\n        </div>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"account-profile-grid\">\r\n      <article class=\"account-profile-card\">\r\n        <h2>Recent Recommendations</h2>\r\n        ")
    ;  if (recommendations && recommendations.length) { 
    ; __append("\r\n          <div class=\"account-activity-list\">\r\n            ")
    ;  recommendations.forEach((item) => { 
    ; __append("\r\n              <div class=\"account-activity-item\">\r\n                <div>\r\n                  <strong><a href=\"/places/")
    ; __append(escapeFn( item.id ))
    ; __append("\">")
    ; __append(escapeFn( item.title ))
    ; __append("</a></strong>\r\n                  <p>")
    ; __append(escapeFn( item.category ))
    ; __append(" • ")
    ; __append(escapeFn( item.city ))
    ; __append(" • ")
    ; __append(escapeFn( formatDate(item.created_at) ))
    ; __append("</p>\r\n                </div>\r\n                <span class=\"badge-status badge-city-soft\">Recommendation</span>\r\n              </div>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"account-profile-bio\">No recommendations submitted yet.</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </article>\r\n\r\n      <article class=\"account-profile-card\">\r\n        <h2>Recent Discussion Posts</h2>\r\n        ")
    ;  if (discussionPosts && discussionPosts.length) { 
    ; __append("\r\n          <div class=\"account-activity-list\">\r\n            ")
    ;  discussionPosts.forEach((post) => { 
    ; __append("\r\n              <div class=\"account-activity-item\">\r\n                <div>\r\n                  <strong><a href=\"/discussion#post-")
    ; __append(escapeFn( post.id ))
    ; __append("\">")
    ; __append(escapeFn( post.title ))
    ; __append("</a></strong>\r\n                  <p>")
    ; __append(escapeFn( post.city ))
    ; __append(" • ")
    ; __append(escapeFn( formatDate(post.created_at) ))
    ; __append("</p>\r\n                </div>\r\n                <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( Number(post.vote_count || 0) ))
    ; __append(" vote")
    ; __append(escapeFn( Number(post.vote_count || 0) === 1 ? '' : 's' ))
    ; __append("</span>\r\n              </div>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"account-profile-bio\">No discussion posts published yet.</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </article>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

},
  "account/settings": function (locals, escapeFn, include, rethrow) {
var account = locals.account, security = locals.security, settings = locals.settings, success = locals.success, error = locals.error, twoFactorSetup = locals.twoFactorSetup;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Account Settings - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  ")
    ;  const memberSince = new Date(account.created_at).toLocaleDateString(); 
    ; __append("\r\n  ")
    ;  const twoFactorEnabledAt = security.two_factor_enabled_at ? new Date(security.two_factor_enabled_at).toLocaleString() : null; 
    ; __append("\r\n  ")
    ;  const activeThemeLabel = settings.interface_theme === 'dark' ? 'Dark' : 'Light'; 
    ; __append("\r\n  ")
    ;  const accountRole = (account.role || 'user').toLowerCase(); 
    ; __append("\r\n  ")
    ;  const isStaffAccount = accountRole === 'employee' || accountRole === 'management' || accountRole === 'admin'; 
    ; __append("\r\n  ")
    ;  const appearanceTabLabel = isStaffAccount ? 'Workspace' : 'Preferences'; 
    ; __append("\r\n  ")
    ;  const appearanceHeading = isStaffAccount ? 'Workspace & Appearance' : 'Preferences & Appearance'; 
    ; __append("\r\n  ")
    ;  const appearanceIntro = isStaffAccount ? 'Set your default operating city, interface theme, timezone, and recommendation focus.' : 'Set your preferred city, interface theme, timezone, and recommendation focus.'; 
    ; __append("\r\n  ")
    ;  const overviewIntro = isStaffAccount ? 'Use this workspace to jump into the part of your account that needs attention now.' : 'Use this page to manage the parts of your guest account that matter right now.'; 
    ; __append("\r\n  ")
    ;  const presenceLabel = isStaffAccount ? 'Public Presence' : 'Profile Visibility'; 
    ; __append("\r\n  ")
    ;  const presenceCopy = isStaffAccount ? 'Current profile visibility determines who can see your identity details.' : 'Choose whether other signed-in members can see your identity details.'; 
    ; __append("\r\n\r\n  <main class=\"container account-settings-page\">\r\n    <section class=\"account-settings-hero\">\r\n      <div>\r\n        <h1>Account Settings</h1>\r\n        <p>Manage your profile, preferences, login security, and deletion controls from one place.</p>\r\n      </div>\r\n      <div class=\"account-settings-meta\">\r\n        <span class=\"badge-status badge-")
    ; __append(escapeFn( account.role ))
    ; __append("\">")
    ; __append(escapeFn( account.role ))
    ; __append("</span>\r\n        <span>Member since ")
    ; __append(escapeFn( new Date(account.created_at).toLocaleDateString() ))
    ; __append("</span>\r\n      </div>\r\n    </section>\r\n\r\n    ")
    ;  if (success) { 
    ; __append("\r\n      <div class=\"alert alert-success\">")
    ; __append(escapeFn( success ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n    ")
    ;  if (error) { 
    ; __append("\r\n      <div class=\"alert alert-error\">")
    ; __append(escapeFn( error ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <section class=\"account-settings-command-center\">\r\n      <div class=\"account-command-card\">\r\n        <div class=\"account-command-profile\">\r\n          <div class=\"account-command-avatar account-avatar-shell\">\r\n            ")
    ;  if (settings.avatar_url) { 
    ; __append("\r\n              <img src=\"")
    ; __append(escapeFn( settings.avatar_url ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( account.username ))
    ; __append(" avatar\" class=\"account-avatar-image\">\r\n            ")
    ;  } else { 
    ; __append("\r\n              <span>")
    ; __append(escapeFn( (settings.display_name || account.username).charAt(0).toUpperCase() ))
    ; __append("</span>\r\n            ")
    ;  } 
    ; __append("\r\n          </div>\r\n          <div>\r\n            <span class=\"account-command-kicker\">Account Control Center</span>\r\n            <h2>")
    ; __append(escapeFn( settings.display_name || account.username ))
    ; __append("</h2>\r\n            <p>")
    ; __append(escapeFn( account.email ))
    ; __append(" · ")
    ; __append(escapeFn( settings.home_city ))
    ; __append(" · ")
    ; __append(escapeFn( security.two_factor_enabled ? '2FA enabled' : '2FA available' ))
    ; __append("</p>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"account-command-stats\">\r\n          <div class=\"account-command-stat\">\r\n            <span>Visibility</span>\r\n            <strong>")
    ; __append(escapeFn( settings.profile_visibility ))
    ; __append("</strong>\r\n          </div>\r\n          <div class=\"account-command-stat\">\r\n            <span>Theme</span>\r\n            <strong>")
    ; __append(escapeFn( activeThemeLabel ))
    ; __append("</strong>\r\n          </div>\r\n          <div class=\"account-command-stat\">\r\n            <span>Joined</span>\r\n            <strong>")
    ; __append(escapeFn( memberSince ))
    ; __append("</strong>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"account-tablist account-tablist-top\" role=\"tablist\" aria-label=\"Account setting sections\">\r\n        <button type=\"button\" class=\"account-tab active\" data-account-tab=\"overview\" role=\"tab\" aria-selected=\"true\">Overview</button>\r\n        <button type=\"button\" class=\"account-tab\" data-account-tab=\"profile\" role=\"tab\" aria-selected=\"false\">Identity</button>\r\n        <button type=\"button\" class=\"account-tab\" data-account-tab=\"appearance\" role=\"tab\" aria-selected=\"false\">")
    ; __append(escapeFn( appearanceTabLabel ))
    ; __append("</button>\r\n        <button type=\"button\" class=\"account-tab\" data-account-tab=\"notifications\" role=\"tab\" aria-selected=\"false\">Alerts</button>\r\n        <button type=\"button\" class=\"account-tab\" data-account-tab=\"security\" role=\"tab\" aria-selected=\"false\">Security</button>\r\n        <button type=\"button\" class=\"account-tab account-tab-danger\" data-account-tab=\"danger\" role=\"tab\" aria-selected=\"false\">Danger Zone</button>\r\n      </div>\r\n\r\n      <div class=\"account-panel-stack\">\r\n        <article class=\"account-tab-panel active\" data-account-panel=\"overview\" role=\"tabpanel\">\r\n          <div class=\"account-panel account-panel-overview\">\r\n            <div class=\"account-panel-head\">\r\n              <h2>Overview</h2>\r\n              <p>")
    ; __append(escapeFn( overviewIntro ))
    ; __append("</p>\r\n            </div>\r\n\r\n            <div class=\"account-overview-grid\">\r\n              <button type=\"button\" class=\"account-overview-tile\" data-account-jump=\"profile\">\r\n                <span class=\"account-overview-tile-label\">Identity</span>\r\n                <strong>")
    ; __append(escapeFn( settings.display_name || account.username ))
    ; __append("</strong>\r\n                <p>Update photo, name, bio, language, and visibility.</p>\r\n              </button>\r\n\r\n              <button type=\"button\" class=\"account-overview-tile\" data-account-jump=\"appearance\">\r\n                <span class=\"account-overview-tile-label\">")
    ; __append(escapeFn( appearanceTabLabel ))
    ; __append("</span>\r\n                <strong>")
    ; __append(escapeFn( settings.home_city ))
    ; __append(" · ")
    ; __append(escapeFn( activeThemeLabel ))
    ; __append("</strong>\r\n                <p>Adjust theme, timezone, city, and recommendation defaults.</p>\r\n              </button>\r\n\r\n              <button type=\"button\" class=\"account-overview-tile\" data-account-jump=\"notifications\">\r\n                <span class=\"account-overview-tile-label\">Alerts</span>\r\n                <strong>")
    ; __append(escapeFn( settings.email_notifications ? 'Email on' : 'Email off' ))
    ; __append("</strong>\r\n                <p>Choose which updates arrive in your inbox or digest.</p>\r\n              </button>\r\n\r\n              <button type=\"button\" class=\"account-overview-tile\" data-account-jump=\"security\">\r\n                <span class=\"account-overview-tile-label\">Security</span>\r\n                <strong>")
    ; __append(escapeFn( security.two_factor_enabled ? 'Protected with 2FA' : 'Password only' ))
    ; __append("</strong>\r\n                <p>Change your password and manage authenticator access.</p>\r\n              </button>\r\n            </div>\r\n\r\n            <div class=\"account-overview-summary-grid\">\r\n              <div class=\"account-summary-card\">\r\n                <span>Profile Photo</span>\r\n                <strong>")
    ; __append(escapeFn( settings.avatar_url ? 'Configured' : 'Missing' ))
    ; __append("</strong>\r\n                <p>")
    ; __append(escapeFn( settings.avatar_url ? 'Your photo is live across the experience.' : 'Add a photo to make your account easier to recognize.' ))
    ; __append("</p>\r\n              </div>\r\n              <div class=\"account-summary-card\">\r\n                <span>")
    ; __append(escapeFn( presenceLabel ))
    ; __append("</span>\r\n                <strong>")
    ; __append(escapeFn( settings.profile_visibility ))
    ; __append("</strong>\r\n                <p>")
    ; __append(escapeFn( presenceCopy ))
    ; __append("</p>\r\n              </div>\r\n              ")
    ;  if (isStaffAccount) { 
    ; __append("\r\n                <div class=\"account-summary-card\">\r\n                  <span>Discussion Digest</span>\r\n                  <strong>")
    ; __append(escapeFn( settings.discussion_digest ? 'Enabled' : 'Disabled' ))
    ; __append("</strong>\r\n                  <p>Digest email summaries for team discussion activity.</p>\r\n                </div>\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"account-tab-panel\" data-account-panel=\"profile\" role=\"tabpanel\" hidden>\r\n          <div class=\"account-panel account-panel-featured\">\r\n            <div class=\"account-panel-head\">\r\n              <h2>Identity & Profile</h2>\r\n              <p>Control how your name, photo, biography, and public-facing account information appear.</p>\r\n            </div>\r\n\r\n            <form action=\"/account/settings/profile\" method=\"POST\" enctype=\"multipart/form-data\" class=\"account-profile-grid\">\r\n              <input type=\"hidden\" name=\"section\" value=\"profile\">\r\n              <input type=\"hidden\" name=\"avatar_crop_data\" id=\"account-avatar-crop-data\">\r\n\r\n              <div class=\"account-avatar-editor\">\r\n                <div class=\"account-avatar-editor-preview\">\r\n                  ")
    ;  if (settings.avatar_url) { 
    ; __append("\r\n                    <img src=\"")
    ; __append(escapeFn( settings.avatar_url ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( account.username ))
    ; __append(" profile photo\" class=\"account-avatar-preview-large\" id=\"accountAvatarPreview\" data-avatar-original=\"")
    ; __append(escapeFn( settings.avatar_url ))
    ; __append("\">\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    <div class=\"account-avatar-preview-large account-avatar-fallback-large\" id=\"accountAvatarPreview\" data-avatar-original=\"\">\r\n                      <span>")
    ; __append(escapeFn( (settings.display_name || account.username).charAt(0).toUpperCase() ))
    ; __append("</span>\r\n                    </div>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n\r\n                <div class=\"account-avatar-editor-copy\">\r\n                  <div class=\"account-avatar-editor-head\">\r\n                    <div>\r\n                      <h3>Profile Photo</h3>\r\n                      <p>Upload a square image for the cleanest result. Works with phone camera, photo library, or desktop files.</p>\r\n                    </div>\r\n                    <span class=\"badge-status badge-city-soft\">Max 3MB</span>\r\n                  </div>\r\n\r\n                  <div class=\"account-upload-card\">\r\n                    <input type=\"file\" id=\"avatar\" name=\"avatar\" accept=\"image/*\" class=\"account-file-input\" aria-describedby=\"account-avatar-help account-avatar-file-name\" disabled>\r\n                    <label for=\"avatar\" class=\"account-upload-trigger\">\r\n                      <span class=\"account-upload-trigger-title\">Photo uploads disabled</span>\r\n                      <span class=\"account-upload-trigger-copy\">File uploads are unavailable in demo mode.</span>\r\n                    </label>\r\n\r\n                    <div class=\"account-upload-meta\">\r\n                      <span class=\"account-upload-file-name\" id=\"account-avatar-file-name\">")
    ; __append(escapeFn( settings.avatar_url ? 'Current photo in use' : 'No file selected yet' ))
    ; __append("</span>\r\n                      <span class=\"account-upload-help\" id=\"account-avatar-help\">JPG, PNG, GIF, or WebP. Mobile browsers can use camera or gallery.</span>\r\n                    </div>\r\n\r\n                    <div class=\"account-upload-actions\">\r\n                      <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"account-avatar-clear\">Clear Selection</button>\r\n                    </div>\r\n\r\n                  </div>\r\n\r\n                  <div class=\"account-avatar-cropper\" id=\"account-avatar-cropper\" hidden aria-hidden=\"true\">\r\n                    <div class=\"account-avatar-cropper-backdrop\" data-avatar-crop-close></div>\r\n                    <div class=\"account-avatar-cropper-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"account-avatar-crop-title\">\r\n                      <div class=\"account-avatar-cropper-head\">\r\n                        <div>\r\n                          <strong id=\"account-avatar-crop-title\">Move Your Photo</strong>\r\n                          <span>Everything inside the circle will become your profile photo.</span>\r\n                        </div>\r\n                        <button type=\"button\" class=\"account-avatar-cropper-close\" id=\"account-avatar-crop-close\" aria-label=\"Close photo crop popup\">Close</button>\r\n                      </div>\r\n\r\n                      <div class=\"account-avatar-crop-stage\">\r\n                        <div class=\"account-avatar-crop-frame\" id=\"account-avatar-crop-frame\">\r\n                          <img src=\"\" alt=\"Avatar crop preview\" id=\"account-avatar-crop-image\" class=\"account-avatar-crop-image\" hidden>\r\n                        </div>\r\n                      </div>\r\n\r\n                      <div class=\"account-avatar-crop-toolbar\">\r\n                        <div class=\"account-avatar-crop-actions\" role=\"group\" aria-label=\"Avatar zoom controls\">\r\n                          <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"account-avatar-zoom-out\">Zoom Out</button>\r\n                          <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"account-avatar-reset\">Reset</button>\r\n                          <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"account-avatar-zoom-in\">Zoom In</button>\r\n                        </div>\r\n                        <p class=\"account-avatar-crop-tip\" id=\"account-avatar-crop-tip\">Drag the full photo in any direction. Use zoom if you want a tighter crop.</p>\r\n                      </div>\r\n\r\n                      <div class=\"account-avatar-crop-footer\">\r\n                        <button type=\"button\" class=\"btn btn-link\" id=\"account-avatar-cancel\">Cancel</button>\r\n                        <button type=\"button\" class=\"btn btn-primary\" id=\"account-avatar-apply\">Use This Photo</button>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <details class=\"account-avatar-advanced\">\r\n                    <summary>Use an external image instead</summary>\r\n                    <div class=\"form-group\">\r\n                      <label for=\"avatar_url\">External Image URL</label>\r\n                      <input type=\"url\" id=\"avatar_url\" name=\"avatar_url\" value=\"")
    ; __append(escapeFn( settings.avatar_url || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n                    </div>\r\n                  </details>\r\n\r\n                  <label class=\"check-card account-inline-check account-remove-photo-option\">\r\n                    <input type=\"checkbox\" name=\"remove_avatar\" value=\"1\" id=\"account-remove-avatar\">\r\n                    <span>\r\n                      <strong>Remove current photo</strong>\r\n                      <small>Revert to your initials avatar until a new image is saved.</small>\r\n                    </span>\r\n                  </label>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"account-panel-section\">\r\n                <h3>Identity</h3>\r\n                <div class=\"account-form-grid\">\r\n                  <div class=\"form-group\">\r\n                    <label for=\"username_readonly\">Username</label>\r\n                    <input type=\"text\" id=\"username_readonly\" value=\"")
    ; __append(escapeFn( account.username ))
    ; __append("\" readonly>\r\n                    <small class=\"muted-text\">")
    ; __append(escapeFn( isStaffAccount ? 'Usernames are managed by admins in governance.' : 'Usernames cannot be edited from account settings.' ))
    ; __append("</small>\r\n                  </div>\r\n\r\n                  <div class=\"form-group\">\r\n                    <label for=\"email\">Email</label>\r\n                    <input type=\"email\" id=\"email\" name=\"email\" value=\"")
    ; __append(escapeFn( account.email ))
    ; __append("\" required>\r\n                  </div>\r\n\r\n                  <div class=\"form-group\">\r\n                    <label for=\"display_name\">Display Name</label>\r\n                    <input type=\"text\" id=\"display_name\" name=\"display_name\" value=\"")
    ; __append(escapeFn( settings.display_name || '' ))
    ; __append("\">\r\n                  </div>\r\n\r\n                  <div class=\"form-group\">\r\n                    <label for=\"profile_visibility\">Profile Visibility</label>\r\n                    <select id=\"profile_visibility\" name=\"profile_visibility\">\r\n                      <option value=\"team\" ")
    ; __append(escapeFn( settings.profile_visibility === 'team' ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( isStaffAccount ? 'Team only' : 'Members only' ))
    ; __append("</option>\r\n                      <option value=\"private\" ")
    ; __append(escapeFn( settings.profile_visibility === 'private' ? 'selected' : '' ))
    ; __append(">Private</option>\r\n                      <option value=\"public\" ")
    ; __append(escapeFn( settings.profile_visibility === 'public' ? 'selected' : '' ))
    ; __append(">Public</option>\r\n                    </select>\r\n                  </div>\r\n\r\n                  <div class=\"form-group\">\r\n                    <label for=\"language\">Language</label>\r\n                    <select id=\"language\" name=\"language\">\r\n                      <option value=\"en\" ")
    ; __append(escapeFn( settings.language === 'en' ? 'selected' : '' ))
    ; __append(">English</option>\r\n                      <option value=\"es\" ")
    ; __append(escapeFn( settings.language === 'es' ? 'selected' : '' ))
    ; __append(">Spanish</option>\r\n                      <option value=\"de\" ")
    ; __append(escapeFn( settings.language === 'de' ? 'selected' : '' ))
    ; __append(">German</option>\r\n                      <option value=\"fr\" ")
    ; __append(escapeFn( settings.language === 'fr' ? 'selected' : '' ))
    ; __append(">French</option>\r\n                    </select>\r\n                  </div>\r\n\r\n                  <div class=\"form-group form-group-full\">\r\n                    <label for=\"bio\">Bio</label>\r\n                    <textarea id=\"bio\" name=\"bio\" rows=\"5\">")
    ; __append(escapeFn( settings.bio || '' ))
    ; __append("</textarea>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-actions form-group-full\">\r\n                <button type=\"submit\" class=\"btn btn-primary\">Save Profile</button>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"account-tab-panel\" data-account-panel=\"appearance\" role=\"tabpanel\" hidden>\r\n          <div class=\"account-panel\">\r\n            <div class=\"account-panel-head\">\r\n              <h2>")
    ; __append(escapeFn( appearanceHeading ))
    ; __append("</h2>\r\n              <p>")
    ; __append(escapeFn( appearanceIntro ))
    ; __append("</p>\r\n            </div>\r\n\r\n            <form action=\"/account/settings/profile\" method=\"POST\" class=\"account-form-grid\">\r\n              <input type=\"hidden\" name=\"section\" value=\"appearance\">\r\n              <input type=\"hidden\" name=\"username\" value=\"")
    ; __append(escapeFn( account.username ))
    ; __append("\">\r\n              <input type=\"hidden\" name=\"email\" value=\"")
    ; __append(escapeFn( account.email ))
    ; __append("\">\r\n              <div class=\"account-customization-grid form-group-full\">\r\n                <div class=\"account-panel-section\">\r\n                  <h3>")
    ; __append(escapeFn( isStaffAccount ? 'Workspace Defaults' : 'Guest Defaults' ))
    ; __append("</h3>\r\n                  <div class=\"account-form-grid\">\r\n                    <div class=\"form-group\">\r\n                      <label for=\"preferences_home_city\">Home City</label>\r\n                      <select id=\"preferences_home_city\" name=\"home_city\">\r\n                        <option value=\"DALLAS\" ")
    ; __append(escapeFn( settings.home_city === 'DALLAS' ? 'selected' : '' ))
    ; __append(">Dallas</option>\r\n                        <option value=\"AUSTIN\" ")
    ; __append(escapeFn( settings.home_city === 'AUSTIN' ? 'selected' : '' ))
    ; __append(">Austin</option>\r\n                      </select>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                      <label for=\"preferences_timezone\">Timezone</label>\r\n                      <input type=\"text\" id=\"preferences_timezone\" name=\"timezone\" value=\"")
    ; __append(escapeFn( settings.timezone || 'UTC' ))
    ; __append("\">\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                      <label for=\"preferences_interface_theme\">Interface Theme</label>\r\n                      <select id=\"preferences_interface_theme\" name=\"interface_theme\">\r\n                        <option value=\"light\" ")
    ; __append(escapeFn( settings.interface_theme === 'light' ? 'selected' : '' ))
    ; __append(">Light</option>\r\n                        <option value=\"dark\" ")
    ; __append(escapeFn( settings.interface_theme === 'dark' ? 'selected' : '' ))
    ; __append(">Dark</option>\r\n                      </select>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"account-preview-card\">\r\n                  <span class=\"account-preview-label\">Live Configuration</span>\r\n                  <h3>")
    ; __append(escapeFn( settings.display_name || account.username ))
    ; __append("</h3>\r\n                  <p>City: <strong>")
    ; __append(escapeFn( settings.home_city ))
    ; __append("</strong></p>\r\n                  <p>Theme: <strong>")
    ; __append(escapeFn( activeThemeLabel ))
    ; __append("</strong></p>\r\n                  <div class=\"account-theme-swatches\">\r\n                    <span class=\"theme-swatch theme-swatch-light ")
    ; __append(escapeFn( settings.interface_theme === 'light' ? 'active' : '' ))
    ; __append("\"></span>\r\n                    <span class=\"theme-swatch theme-swatch-dark ")
    ; __append(escapeFn( settings.interface_theme === 'dark' ? 'active' : '' ))
    ; __append("\"></span>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-actions form-group-full\">\r\n                <button type=\"submit\" class=\"btn btn-primary\">Save ")
    ; __append(escapeFn( appearanceTabLabel ))
    ; __append("</button>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"account-tab-panel\" data-account-panel=\"notifications\" role=\"tabpanel\" hidden>\r\n          <div class=\"account-panel\">\r\n            <div class=\"account-panel-head\">\r\n              <h2>Alerts & Messaging</h2>\r\n              <p>Choose which platform updates reach you and which communications stay enabled.</p>\r\n            </div>\r\n\r\n            <form action=\"/account/settings/profile\" method=\"POST\" class=\"account-form-grid\">\r\n              <input type=\"hidden\" name=\"section\" value=\"notifications\">\r\n\r\n              <div class=\"form-group form-group-full account-notification-stack\">\r\n                <label class=\"check-card account-notification-card\">\r\n                  <input type=\"checkbox\" name=\"email_notifications\" value=\"1\" ")
    ; __append(escapeFn( settings.email_notifications ? 'checked' : '' ))
    ; __append(">\r\n                  <span>\r\n                    <strong>Email Notifications</strong>\r\n                    <small>Receive important account and booking-related notices by email.</small>\r\n                  </span>\r\n                </label>\r\n\r\n                ")
    ;  if (isStaffAccount) { 
    ; __append("\r\n                  <label class=\"check-card account-notification-card\">\r\n                    <input type=\"checkbox\" name=\"discussion_digest\" value=\"1\" ")
    ; __append(escapeFn( settings.discussion_digest ? 'checked' : '' ))
    ; __append(">\r\n                    <span>\r\n                      <strong>Discussion Digest</strong>\r\n                      <small>Get recurring summaries for team updates and recommendation discussions.</small>\r\n                    </span>\r\n                  </label>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <label class=\"check-card account-notification-card\">\r\n                  <input type=\"checkbox\" name=\"marketing_notifications\" value=\"1\" ")
    ; __append(escapeFn( settings.marketing_notifications ? 'checked' : '' ))
    ; __append(">\r\n                  <span>\r\n                    <strong>Marketing Updates</strong>\r\n                    <small>Allow promotional and feature-announcement emails about new concierge capabilities.</small>\r\n                  </span>\r\n                </label>\r\n              </div>\r\n\r\n              <div class=\"form-actions form-group-full\">\r\n                <button type=\"submit\" class=\"btn btn-primary\">Save Notifications</button>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"account-tab-panel\" data-account-panel=\"security\" role=\"tabpanel\" hidden>\r\n          <div class=\"account-panel-stack-inner\">\r\n            <div class=\"account-panel\">\r\n              <div class=\"account-panel-head\">\r\n                <h2>Password</h2>\r\n                <p>Use a strong password and rotate it when access changes or you suspect exposure.</p>\r\n              </div>\r\n\r\n              <form action=\"/account/settings/password\" method=\"POST\" class=\"account-form-grid\">\r\n                <div class=\"form-group form-group-full\">\r\n                  <label for=\"currentPassword\">Current Password</label>\r\n                  <input type=\"password\" id=\"currentPassword\" name=\"currentPassword\" required>\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"newPassword\">New Password</label>\r\n                  <input type=\"password\" id=\"newPassword\" name=\"newPassword\" minlength=\"8\" required>\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"confirmPassword\">Confirm New Password</label>\r\n                  <input type=\"password\" id=\"confirmPassword\" name=\"confirmPassword\" minlength=\"8\" required>\r\n                </div>\r\n\r\n                <div class=\"form-actions form-group-full\">\r\n                  <button type=\"submit\" class=\"btn btn-secondary\">Update Password</button>\r\n                </div>\r\n              </form>\r\n            </div>\r\n\r\n            <div class=\"account-panel\">\r\n              <div class=\"account-panel-head\">\r\n                <h2>Two-Factor Authentication</h2>\r\n                <p>Protect sign-in with a time-based code from your authenticator app.</p>\r\n              </div>\r\n\r\n              ")
    ;  if (security.two_factor_enabled) { 
    ; __append("\r\n                <div class=\"account-status-card success-state\">\r\n                  <strong>2FA is enabled.</strong>\r\n                  <p>Enabled on ")
    ; __append(escapeFn( twoFactorEnabledAt ))
    ; __append(".</p>\r\n                </div>\r\n\r\n                <form action=\"/account/settings/2fa/disable\" method=\"POST\" class=\"account-form-grid\">\r\n                  <div class=\"form-group\">\r\n                    <label for=\"disableCurrentPassword\">Current Password</label>\r\n                    <input type=\"password\" id=\"disableCurrentPassword\" name=\"currentPassword\" required>\r\n                  </div>\r\n                  <div class=\"form-group\">\r\n                    <label for=\"disableVerificationCode\">Authenticator Code</label>\r\n                    <input type=\"text\" id=\"disableVerificationCode\" name=\"verificationCode\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" maxlength=\"6\" required>\r\n                  </div>\r\n                  <div class=\"form-actions form-group-full\">\r\n                    <button type=\"submit\" class=\"btn btn-secondary\">Disable 2FA</button>\r\n                  </div>\r\n                </form>\r\n              ")
    ;  } else { 
    ; __append("\r\n                <div class=\"account-status-card info-state\">\r\n                  <strong>2FA is not enabled.</strong>\r\n                  <p>Generate a setup key to add authenticator-based login verification.</p>\r\n                </div>\r\n\r\n                <form action=\"/account/settings/2fa/setup\" method=\"POST\" class=\"form-actions\">\r\n                  <button type=\"submit\" class=\"btn btn-primary\">Generate 2FA Setup</button>\r\n                </form>\r\n\r\n                ")
    ;  if (twoFactorSetup) { 
    ; __append("\r\n                  <div class=\"two-factor-setup-card\">\r\n                    <img src=\"")
    ; __append(escapeFn( twoFactorSetup.qrCodeDataUrl ))
    ; __append("\" alt=\"Two-factor setup QR code\" class=\"two-factor-qr\">\r\n                    <div>\r\n                      <p>Scan this QR code with Google Authenticator, 1Password, Microsoft Authenticator, or any TOTP app.</p>\r\n                      <p><strong>Manual key:</strong> ")
    ; __append(escapeFn( twoFactorSetup.manualKey ))
    ; __append("</p>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <form action=\"/account/settings/2fa/enable\" method=\"POST\" class=\"account-form-grid\">\r\n                    <div class=\"form-group\">\r\n                      <label for=\"enableCurrentPassword\">Current Password</label>\r\n                      <input type=\"password\" id=\"enableCurrentPassword\" name=\"currentPassword\" required>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                      <label for=\"enableVerificationCode\">Authenticator Code</label>\r\n                      <input type=\"text\" id=\"enableVerificationCode\" name=\"verificationCode\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" maxlength=\"6\" required>\r\n                    </div>\r\n                    <div class=\"form-actions form-group-full\">\r\n                      <button type=\"submit\" class=\"btn btn-primary\">Enable 2FA</button>\r\n                    </div>\r\n                  </form>\r\n                ")
    ;  } 
    ; __append("\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"account-tab-panel\" data-account-panel=\"danger\" role=\"tabpanel\" hidden>\r\n          <div class=\"account-panel account-panel-danger\">\r\n            <div class=\"account-panel-head\">\r\n              <h2>Danger Zone</h2>\r\n              <p>Delete this account permanently from active use. This immediately disables sign-in and ends your session.</p>\r\n            </div>\r\n\r\n            <div class=\"account-danger-note\">\r\n              <strong>Before you continue</strong>\r\n              <p>Deleting your account removes access, clears active security setup, and renames the account record for audit safety.</p>\r\n            </div>\r\n\r\n            <form action=\"/account/settings/delete\" method=\"POST\" class=\"account-form-grid\">\r\n              <div class=\"form-group form-group-full\">\r\n                <label for=\"deleteCurrentPassword\">Current Password</label>\r\n                <input type=\"password\" id=\"deleteCurrentPassword\" name=\"currentPassword\" required>\r\n              </div>\r\n\r\n              ")
    ;  if (security.two_factor_enabled) { 
    ; __append("\r\n                <div class=\"form-group form-group-full\">\r\n                  <label for=\"deleteVerificationCode\">Authenticator Code</label>\r\n                  <input type=\"text\" id=\"deleteVerificationCode\" name=\"verificationCode\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" maxlength=\"6\" required>\r\n                </div>\r\n              ")
    ;  } 
    ; __append("\r\n\r\n              <div class=\"form-group form-group-full\">\r\n                <label for=\"confirmationText\">Type DELETE to confirm</label>\r\n                <input type=\"text\" id=\"confirmationText\" name=\"confirmationText\" placeholder=\"DELETE\" required>\r\n              </div>\r\n\r\n              <div class=\"form-actions form-group-full\">\r\n                <button type=\"submit\" class=\"btn btn-danger\">Delete Account</button>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </article>\r\n      </div>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n\r\n  <script>\r\n    (() => {\r\n      const tabs = Array.from(document.querySelectorAll('[data-account-tab]'));\r\n      const panels = Array.from(document.querySelectorAll('[data-account-panel]'));\r\n      const jumpButtons = Array.from(document.querySelectorAll('[data-account-jump]'));\r\n      const avatarInput = document.getElementById('avatar');\r\n      const avatarPreview = document.getElementById('accountAvatarPreview');\r\n      const avatarFileName = document.getElementById('account-avatar-file-name');\r\n      const avatarClearButton = document.getElementById('account-avatar-clear');\r\n      const removeAvatarCheckbox = document.getElementById('account-remove-avatar');\r\n      const avatarUrlInput = document.getElementById('avatar_url');\r\n      const avatarCropper = document.getElementById('account-avatar-cropper');\r\n      const avatarCropFrame = document.getElementById('account-avatar-crop-frame');\r\n      const avatarCropImage = document.getElementById('account-avatar-crop-image');\r\n      const avatarCropData = document.getElementById('account-avatar-crop-data');\r\n      const avatarCropCloseButton = document.getElementById('account-avatar-crop-close');\r\n      const avatarCropCancelButton = document.getElementById('account-avatar-cancel');\r\n      const avatarCropApplyButton = document.getElementById('account-avatar-apply');\r\n      const avatarZoomOutButton = document.getElementById('account-avatar-zoom-out');\r\n      const avatarZoomInButton = document.getElementById('account-avatar-zoom-in');\r\n      const avatarResetButton = document.getElementById('account-avatar-reset');\r\n      const profileForm = document.querySelector('form[action=\"/account/settings/profile\"]');\r\n      const avatarCropState = {\r\n        source: '',\r\n        image: null,\r\n        zoom: 1,\r\n        offsetX: 0,\r\n        offsetY: 0,\r\n        pointerId: null,\r\n        dragOriginX: 0,\r\n        dragOriginY: 0,\r\n        startOffsetX: 0,\r\n        startOffsetY: 0,\r\n        isOpen: false,\r\n        pendingFileName: '',\r\n        appliedDataUrl: ''\r\n      };\r\n\r\n      const activateTab = (tabName) => {\r\n        window.sessionStorage.setItem('accountSettingsActiveTab', tabName);\r\n\r\n        tabs.forEach((tab) => {\r\n          const isActive = tab.dataset.accountTab === tabName;\r\n          tab.classList.toggle('active', isActive);\r\n          tab.setAttribute('aria-selected', isActive ? 'true' : 'false');\r\n        });\r\n\r\n        panels.forEach((panel) => {\r\n          const isActive = panel.dataset.accountPanel === tabName;\r\n          panel.classList.toggle('active', isActive);\r\n          panel.hidden = !isActive;\r\n        });\r\n      };\r\n\r\n      tabs.forEach((tab) => {\r\n        tab.addEventListener('click', () => activateTab(tab.dataset.accountTab));\r\n      });\r\n\r\n      jumpButtons.forEach((button) => {\r\n        button.addEventListener('click', () => activateTab(button.dataset.accountJump));\r\n      });\r\n\r\n      const createFallbackPreview = () => {\r\n        const fallback = document.createElement('div');\r\n        fallback.id = 'accountAvatarPreview';\r\n        fallback.dataset.avatarOriginal = avatarPreview ? avatarPreview.dataset.avatarOriginal || '' : '';\r\n        fallback.className = 'account-avatar-preview-large account-avatar-fallback-large';\r\n        const label = document.getElementById('display_name');\r\n        const fallbackLetter = ((label && label.value) || '")
    ; __append(escapeFn( (settings.display_name || account.username).charAt(0).toUpperCase() ))
    ; __append("').trim().charAt(0).toUpperCase() || '")
    ; __append(escapeFn( account.username.charAt(0).toUpperCase() ))
    ; __append("';\r\n        fallback.innerHTML = `<span>${fallbackLetter}</span>`;\r\n        return fallback;\r\n      };\r\n\r\n      const resetAvatarPreview = () => {\r\n        const preview = document.getElementById('accountAvatarPreview');\r\n        const original = preview ? preview.dataset.avatarOriginal || '' : '';\r\n        const previewContainer = preview ? preview.parentElement : null;\r\n        if (!previewContainer) return;\r\n\r\n        if (original) {\r\n          const image = document.createElement('img');\r\n          image.id = 'accountAvatarPreview';\r\n          image.className = 'account-avatar-preview-large';\r\n          image.alt = '")
    ; __append(escapeFn( account.username ))
    ; __append(" profile photo';\r\n          image.src = original;\r\n          image.dataset.avatarOriginal = original;\r\n          preview.replaceWith(image);\r\n        } else {\r\n          preview.replaceWith(createFallbackPreview());\r\n        }\r\n      };\r\n\r\n      const resetCropControls = () => {\r\n        avatarCropState.zoom = 1;\r\n        avatarCropState.offsetX = 0;\r\n        avatarCropState.offsetY = 0;\r\n        avatarCropState.pointerId = null;\r\n      };\r\n\r\n      const openCropper = () => {\r\n        if (!avatarCropper) {\r\n          return;\r\n        }\r\n\r\n        avatarCropState.isOpen = true;\r\n        avatarCropper.hidden = false;\r\n        avatarCropper.setAttribute('aria-hidden', 'false');\r\n        document.body.classList.add('account-avatar-crop-open');\r\n      };\r\n\r\n      const closeCropper = ({ clearPendingFile = false, restoreAppliedPreview = false } = {}) => {\r\n        if (avatarCropper) {\r\n          avatarCropper.hidden = true;\r\n          avatarCropper.setAttribute('aria-hidden', 'true');\r\n        }\r\n\r\n        document.body.classList.remove('account-avatar-crop-open');\r\n        avatarCropState.isOpen = false;\r\n        avatarCropState.pointerId = null;\r\n        if (avatarCropFrame) {\r\n          avatarCropFrame.classList.remove('is-dragging');\r\n        }\r\n        if (avatarCropImage) {\r\n          avatarCropImage.classList.remove('is-dragging');\r\n        }\r\n\r\n        if (clearPendingFile && avatarInput) {\r\n          avatarInput.value = '';\r\n          avatarCropState.pendingFileName = '';\r\n        }\r\n\r\n        if (restoreAppliedPreview) {\r\n          if (avatarCropState.appliedDataUrl) {\r\n            const preview = document.getElementById('accountAvatarPreview');\r\n            if (preview) {\r\n              const image = document.createElement('img');\r\n              image.id = 'accountAvatarPreview';\r\n              image.className = 'account-avatar-preview-large';\r\n              image.alt = '")
    ; __append(escapeFn( account.username ))
    ; __append(" cropped profile photo preview';\r\n              image.src = avatarCropState.appliedDataUrl;\r\n              image.dataset.avatarOriginal = preview.dataset.avatarOriginal || '';\r\n              preview.replaceWith(image);\r\n            }\r\n          } else {\r\n            resetAvatarPreview();\r\n          }\r\n        }\r\n      };\r\n\r\n      const clampCropOffsets = () => {\r\n        if (!avatarCropState.image || !avatarCropFrame) {\r\n          return;\r\n        }\r\n\r\n        const cropSize = avatarCropFrame.clientWidth || 220;\r\n        const naturalWidth = avatarCropState.image.naturalWidth || 1;\r\n        const naturalHeight = avatarCropState.image.naturalHeight || 1;\r\n        const baseScale = Math.max(cropSize / naturalWidth, cropSize / naturalHeight);\r\n        const displayWidth = naturalWidth * baseScale * avatarCropState.zoom;\r\n        const displayHeight = naturalHeight * baseScale * avatarCropState.zoom;\r\n        const maxOffsetX = Math.max(0, (displayWidth - cropSize) / 2);\r\n        const maxOffsetY = Math.max(0, (displayHeight - cropSize) / 2);\r\n\r\n        avatarCropState.offsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, avatarCropState.offsetX));\r\n        avatarCropState.offsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, avatarCropState.offsetY));\r\n      };\r\n\r\n      const clearCropper = () => {\r\n        avatarCropState.source = '';\r\n        avatarCropState.image = null;\r\n        resetCropControls();\r\n        if (avatarCropData) {\r\n          avatarCropData.value = '';\r\n        }\r\n        if (avatarCropImage) {\r\n          avatarCropImage.src = '';\r\n          avatarCropImage.hidden = true;\r\n          avatarCropImage.classList.remove('is-dragging');\r\n        }\r\n        closeCropper();\r\n      };\r\n\r\n      const buildCroppedAvatarDataUrl = () => {\r\n        if (!avatarCropState.image || !avatarCropFrame) {\r\n          return '';\r\n        }\r\n\r\n        const cropSize = avatarCropFrame.clientWidth || 220;\r\n        const outputSize = 512;\r\n        const naturalWidth = avatarCropState.image.naturalWidth || 1;\r\n        const naturalHeight = avatarCropState.image.naturalHeight || 1;\r\n        const baseScale = Math.max(cropSize / naturalWidth, cropSize / naturalHeight);\r\n        const displayWidth = naturalWidth * baseScale * avatarCropState.zoom;\r\n        const displayHeight = naturalHeight * baseScale * avatarCropState.zoom;\r\n        const ratio = outputSize / cropSize;\r\n        const drawX = ((cropSize - displayWidth) / 2 + avatarCropState.offsetX) * ratio;\r\n        const drawY = ((cropSize - displayHeight) / 2 + avatarCropState.offsetY) * ratio;\r\n        const drawWidth = displayWidth * ratio;\r\n        const drawHeight = displayHeight * ratio;\r\n        const canvas = document.createElement('canvas');\r\n        canvas.width = outputSize;\r\n        canvas.height = outputSize;\r\n        const context = canvas.getContext('2d');\r\n        context.clearRect(0, 0, outputSize, outputSize);\r\n        context.save();\r\n        context.beginPath();\r\n        context.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);\r\n        context.closePath();\r\n        context.clip();\r\n        context.drawImage(avatarCropState.image, drawX, drawY, drawWidth, drawHeight);\r\n        context.restore();\r\n        return canvas.toDataURL('image/png');\r\n      };\r\n\r\n      const applyCropperImageStyles = () => {\r\n        if (!avatarCropState.image || !avatarCropImage || !avatarCropFrame) {\r\n          return;\r\n        }\r\n\r\n        const cropSize = avatarCropFrame.clientWidth || 220;\r\n        const naturalWidth = avatarCropState.image.naturalWidth || 1;\r\n        const naturalHeight = avatarCropState.image.naturalHeight || 1;\r\n        const baseScale = Math.max(cropSize / naturalWidth, cropSize / naturalHeight);\r\n        const displayWidth = naturalWidth * baseScale * avatarCropState.zoom;\r\n        const displayHeight = naturalHeight * baseScale * avatarCropState.zoom;\r\n        clampCropOffsets();\r\n\r\n        avatarCropImage.hidden = false;\r\n        avatarCropImage.style.width = `${displayWidth}px`;\r\n        avatarCropImage.style.height = `${displayHeight}px`;\r\n        avatarCropImage.style.transform = `translate(-50%, -50%) translate(${avatarCropState.offsetX}px, ${avatarCropState.offsetY}px)`;\r\n\r\n        const croppedDataUrl = buildCroppedAvatarDataUrl();\r\n        if (avatarCropData) {\r\n          avatarCropData.value = croppedDataUrl;\r\n        }\r\n      };\r\n\r\n      const loadCropperFromSource = (source) => {\r\n        if (!avatarCropper || !avatarCropImage || !source) {\r\n          return;\r\n        }\r\n\r\n        resetCropControls();\r\n        avatarCropState.source = source;\r\n        openCropper();\r\n        avatarCropImage.src = source;\r\n\r\n        const image = new Image();\r\n        image.onload = () => {\r\n          avatarCropState.image = image;\r\n          applyCropperImageStyles();\r\n        };\r\n        image.src = source;\r\n      };\r\n\r\n      const applyCroppedPreview = () => {\r\n        const croppedDataUrl = buildCroppedAvatarDataUrl();\r\n        const preview = document.getElementById('accountAvatarPreview');\r\n\r\n        if (!croppedDataUrl || !preview) {\r\n          return;\r\n        }\r\n\r\n        avatarCropState.appliedDataUrl = croppedDataUrl;\r\n        if (avatarCropData) {\r\n          avatarCropData.value = croppedDataUrl;\r\n        }\r\n\r\n        const image = document.createElement('img');\r\n        image.id = 'accountAvatarPreview';\r\n        image.className = 'account-avatar-preview-large';\r\n        image.alt = '")
    ; __append(escapeFn( account.username ))
    ; __append(" cropped profile photo preview';\r\n        image.src = croppedDataUrl;\r\n        image.dataset.avatarOriginal = preview.dataset.avatarOriginal || '';\r\n        preview.replaceWith(image);\r\n      };\r\n\r\n      const stepAvatarZoom = (direction) => {\r\n        const nextZoom = avatarCropState.zoom + (direction * 0.12);\r\n        avatarCropState.zoom = Math.min(2.4, Math.max(1, Number(nextZoom.toFixed(2))));\r\n        applyCropperImageStyles();\r\n      };\r\n\r\n      if (avatarZoomOutButton) {\r\n        avatarZoomOutButton.addEventListener('click', () => stepAvatarZoom(-1));\r\n      }\r\n\r\n      if (avatarZoomInButton) {\r\n        avatarZoomInButton.addEventListener('click', () => stepAvatarZoom(1));\r\n      }\r\n\r\n      if (avatarResetButton) {\r\n        avatarResetButton.addEventListener('click', () => {\r\n          resetCropControls();\r\n          applyCropperImageStyles();\r\n        });\r\n      }\r\n\r\n      if (avatarCropApplyButton) {\r\n        avatarCropApplyButton.addEventListener('click', () => {\r\n          applyCroppedPreview();\r\n          if (avatarFileName) {\r\n            avatarFileName.textContent = avatarCropState.pendingFileName || 'Photo ready to save';\r\n          }\r\n          closeCropper();\r\n        });\r\n      }\r\n\r\n      [avatarCropCloseButton, avatarCropCancelButton].forEach((button) => {\r\n        if (!button) {\r\n          return;\r\n        }\r\n\r\n        button.addEventListener('click', () => {\r\n          closeCropper({ clearPendingFile: true, restoreAppliedPreview: true });\r\n        });\r\n      });\r\n\r\n      if (avatarCropper) {\r\n        avatarCropper.querySelectorAll('[data-avatar-crop-close]').forEach((element) => {\r\n          element.addEventListener('click', () => {\r\n            closeCropper({ clearPendingFile: true, restoreAppliedPreview: true });\r\n          });\r\n        });\r\n      }\r\n\r\n      if (avatarCropFrame) {\r\n        avatarCropFrame.addEventListener('pointerdown', (event) => {\r\n          if (!avatarCropState.image || !avatarCropImage) {\r\n            return;\r\n          }\r\n\r\n          avatarCropState.pointerId = event.pointerId;\r\n          avatarCropState.dragOriginX = event.clientX;\r\n          avatarCropState.dragOriginY = event.clientY;\r\n          avatarCropState.startOffsetX = avatarCropState.offsetX;\r\n          avatarCropState.startOffsetY = avatarCropState.offsetY;\r\n          avatarCropImage.classList.add('is-dragging');\r\n          avatarCropFrame.classList.add('is-dragging');\r\n          avatarCropFrame.setPointerCapture(event.pointerId);\r\n        });\r\n\r\n        avatarCropFrame.addEventListener('pointermove', (event) => {\r\n          if (avatarCropState.pointerId !== event.pointerId || !avatarCropState.image) {\r\n            return;\r\n          }\r\n\r\n          avatarCropState.offsetX = avatarCropState.startOffsetX + (event.clientX - avatarCropState.dragOriginX);\r\n          avatarCropState.offsetY = avatarCropState.startOffsetY + (event.clientY - avatarCropState.dragOriginY);\r\n          applyCropperImageStyles();\r\n        });\r\n\r\n        const releasePointerDrag = (event) => {\r\n          if (avatarCropState.pointerId !== event.pointerId) {\r\n            return;\r\n          }\r\n\r\n          avatarCropState.pointerId = null;\r\n          avatarCropFrame.classList.remove('is-dragging');\r\n          if (avatarCropImage) {\r\n            avatarCropImage.classList.remove('is-dragging');\r\n          }\r\n\r\n          if (avatarCropFrame.hasPointerCapture(event.pointerId)) {\r\n            avatarCropFrame.releasePointerCapture(event.pointerId);\r\n          }\r\n        };\r\n\r\n        avatarCropFrame.addEventListener('pointerup', releasePointerDrag);\r\n        avatarCropFrame.addEventListener('pointercancel', releasePointerDrag);\r\n        avatarCropFrame.addEventListener('pointerleave', (event) => {\r\n          if (event.pointerType === 'mouse') {\r\n            releasePointerDrag(event);\r\n          }\r\n        });\r\n\r\n        avatarCropFrame.addEventListener('wheel', (event) => {\r\n          if (!avatarCropState.image) {\r\n            return;\r\n          }\r\n\r\n          event.preventDefault();\r\n          stepAvatarZoom(event.deltaY > 0 ? -1 : 1);\r\n        }, { passive: false });\r\n      }\r\n\r\n      if (avatarInput && avatarPreview && avatarFileName) {\r\n        avatarInput.addEventListener('change', () => {\r\n          const [file] = avatarInput.files || [];\r\n\r\n          if (!file) {\r\n            avatarFileName.textContent = avatarPreview.dataset.avatarOriginal ? 'Current photo in use' : 'No file selected yet';\r\n            clearCropper();\r\n            resetAvatarPreview();\r\n            return;\r\n          }\r\n\r\n          avatarFileName.textContent = file.name;\r\n          avatarCropState.pendingFileName = file.name;\r\n          if (removeAvatarCheckbox) {\r\n            removeAvatarCheckbox.checked = false;\r\n          }\r\n          if (avatarUrlInput) {\r\n            avatarUrlInput.value = '';\r\n          }\r\n\r\n          const reader = new FileReader();\r\n          reader.onload = (event) => {\r\n            loadCropperFromSource(event.target.result);\r\n          };\r\n          reader.readAsDataURL(file);\r\n        });\r\n      }\r\n\r\n      if (avatarClearButton && avatarInput) {\r\n        avatarClearButton.addEventListener('click', () => {\r\n          avatarInput.value = '';\r\n          avatarCropState.pendingFileName = '';\r\n          avatarCropState.appliedDataUrl = '';\r\n          clearCropper();\r\n          if (avatarFileName) {\r\n            const preview = document.getElementById('accountAvatarPreview');\r\n            avatarFileName.textContent = preview && preview.dataset.avatarOriginal ? 'Current photo in use' : 'No file selected yet';\r\n          }\r\n          resetAvatarPreview();\r\n        });\r\n      }\r\n\r\n      window.addEventListener('resize', () => {\r\n        if (avatarCropState.image && avatarCropState.isOpen) {\r\n          applyCropperImageStyles();\r\n        }\r\n      });\r\n\r\n      window.addEventListener('keydown', (event) => {\r\n        if (event.key === 'Escape' && avatarCropState.isOpen) {\r\n          closeCropper({ clearPendingFile: true, restoreAppliedPreview: true });\r\n        }\r\n      });\r\n\r\n      if (avatarUrlInput) {\r\n        avatarUrlInput.addEventListener('input', () => {\r\n          if (!avatarUrlInput.value.trim()) {\r\n            return;\r\n          }\r\n\r\n          if (avatarInput) {\r\n            avatarInput.value = '';\r\n          }\r\n          avatarCropState.pendingFileName = '';\r\n          avatarCropState.appliedDataUrl = '';\r\n          clearCropper();\r\n          if (avatarFileName) {\r\n            avatarFileName.textContent = 'External image URL will be used';\r\n          }\r\n          if (removeAvatarCheckbox) {\r\n            removeAvatarCheckbox.checked = false;\r\n          }\r\n          resetAvatarPreview();\r\n        });\r\n      }\r\n\r\n      if (removeAvatarCheckbox) {\r\n        removeAvatarCheckbox.addEventListener('change', () => {\r\n          if (!removeAvatarCheckbox.checked) return;\r\n          if (avatarInput) {\r\n            avatarInput.value = '';\r\n          }\r\n          avatarCropState.pendingFileName = '';\r\n          avatarCropState.appliedDataUrl = '';\r\n          clearCropper();\r\n          if (avatarFileName) {\r\n            avatarFileName.textContent = 'Current photo will be removed when you save';\r\n          }\r\n          resetAvatarPreview();\r\n        });\r\n      }\r\n\r\n      if (profileForm) {\r\n        profileForm.addEventListener('submit', () => {\r\n          if (!avatarCropData) {\r\n            return;\r\n          }\r\n\r\n          if (removeAvatarCheckbox && removeAvatarCheckbox.checked) {\r\n            avatarCropData.value = '';\r\n            return;\r\n          }\r\n\r\n          if (avatarInput && avatarInput.files && avatarInput.files.length) {\r\n            avatarCropData.value = avatarCropState.appliedDataUrl || buildCroppedAvatarDataUrl();\r\n          } else if (!avatarUrlInput || !avatarUrlInput.value.trim()) {\r\n            avatarCropData.value = '';\r\n          }\r\n        });\r\n      }\r\n\r\n      const params = new URLSearchParams(window.location.search);\r\n      const targetTab = params.get('tab');\r\n      if (targetTab && tabs.some((tab) => tab.dataset.accountTab === targetTab)) {\r\n        activateTab(targetTab);\r\n        return;\r\n      }\r\n\r\n      const storedTab = window.sessionStorage.getItem('accountSettingsActiveTab');\r\n      if (storedTab && tabs.some((tab) => tab.dataset.accountTab === storedTab)) {\r\n        activateTab(storedTab);\r\n        return;\r\n      }\r\n\r\n      activateTab('overview');\r\n    })();\r\n  </script>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "account/team": function (locals, escapeFn, include, rethrow) {
var viewerRole = locals.viewerRole, activeCity = locals.activeCity, teamMembers = locals.teamMembers;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Team Directory - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container account-directory-page\">\r\n    <section class=\"team-directory-hero\">\r\n      <div>\r\n        <h1>Team Directory</h1>\r\n        <p>\r\n          ")
    ;  if (viewerRole === 'admin' || viewerRole === 'management') { 
    ; __append("\r\n            Review internal staff accounts across all active properties.\r\n          ")
    ;  } else { 
    ; __append("\r\n            View coworker account details for <strong>")
    ; __append(escapeFn( activeCity ))
    ; __append("</strong> without opening anyone else’s settings workspace.\r\n          ")
    ;  } 
    ; __append("\r\n        </p>\r\n      </div>\r\n      <div class=\"account-profile-actions\">\r\n        <a href=\"/employee\" class=\"btn btn-secondary\">Back to Workspace</a>\r\n        <a href=\"/account/settings\" class=\"btn btn-primary\">My Settings</a>\r\n      </div>\r\n    </section>\r\n\r\n    ")
    ;  if (teamMembers && teamMembers.length) { 
    ; __append("\r\n      <section class=\"team-directory-grid\">\r\n        ")
    ;  teamMembers.forEach((member) => { 
    ; __append("\r\n          <article class=\"team-member-card\">\r\n            <div class=\"team-member-card-head\">\r\n              <div class=\"team-member-avatar\">\r\n                ")
    ;  if (member.avatar_url) { 
    ; __append("\r\n                  <img src=\"")
    ; __append(escapeFn( member.avatar_url ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( member.displayName ))
    ; __append(" avatar\">\r\n                ")
    ;  } else { 
    ; __append("\r\n                  <span>")
    ; __append(escapeFn( member.initials ))
    ; __append("</span>\r\n                ")
    ;  } 
    ; __append("\r\n              </div>\r\n              <div>\r\n                <h2>")
    ; __append(escapeFn( member.displayName ))
    ; __append("</h2>\r\n                <p class=\"team-member-subtitle\">")
    ; __append(escapeFn( member.email ))
    ; __append("</p>\r\n                <div class=\"team-city-list\">\r\n                  <span class=\"badge-status badge-")
    ; __append(escapeFn( member.role ))
    ; __append("\">")
    ; __append(escapeFn( member.role ))
    ; __append("</span>\r\n                  ")
    ;  if (member.isCurrentUser) { 
    ; __append("\r\n                    <span class=\"badge-status badge-city-soft\">Your Account</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            <div class=\"team-member-meta\">\r\n              <div>\r\n                <span>Role</span>\r\n                <strong>")
    ; __append(escapeFn( member.department ? member.department : member.role ))
    ; __append(escapeFn( member.title ? ' - ' + member.title : '' ))
    ; __append("</strong>\r\n              </div>\r\n              <div>\r\n                <span>Joined</span>\r\n                <strong>")
    ; __append(escapeFn( new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ))
    ; __append("</strong>\r\n              </div>\r\n              <div>\r\n                <span>City Access</span>\r\n                <div class=\"team-city-list\">\r\n                  ")
    ;  member.cities.forEach((cityName) => { 
    ; __append("\r\n                    <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( cityName ))
    ; __append("</span>\r\n                  ")
    ;  }) 
    ; __append("\r\n                </div>\r\n              </div>\r\n              <div>\r\n                <span>Activity</span>\r\n                <div class=\"team-city-list\">\r\n                  <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( member.recommendationCount ))
    ; __append(" recommendation")
    ; __append(escapeFn( member.recommendationCount === 1 ? '' : 's' ))
    ; __append("</span>\r\n                  <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( member.discussionPostCount ))
    ; __append(" discussion post")
    ; __append(escapeFn( member.discussionPostCount === 1 ? '' : 's' ))
    ; __append("</span>\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            ")
    ;  if (member.bio) { 
    ; __append("\r\n              <p class=\"account-profile-bio\">")
    ; __append(escapeFn( member.bio ))
    ; __append("</p>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            <div class=\"account-activity-list\">\r\n              <div class=\"account-activity-item\">\r\n                <div>\r\n                  <strong>Recent Recommendations</strong>\r\n                  ")
    ;  if (member.recentRecommendations && member.recentRecommendations.length) { 
    ; __append("\r\n                    ")
    ;  member.recentRecommendations.forEach((item) => { 
    ; __append("\r\n                      <p><a href=\"/places/")
    ; __append(escapeFn( item.id ))
    ; __append("\">")
    ; __append(escapeFn( item.title ))
    ; __append("</a></p>\r\n                    ")
    ;  }) 
    ; __append("\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    <p>No recommendations yet.</p>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"account-activity-item\">\r\n                <div>\r\n                  <strong>Recent Discussion Posts</strong>\r\n                  ")
    ;  if (member.recentDiscussionPosts && member.recentDiscussionPosts.length) { 
    ; __append("\r\n                    ")
    ;  member.recentDiscussionPosts.forEach((post) => { 
    ; __append("\r\n                      <p><a href=\"/discussion#post-")
    ; __append(escapeFn( post.id ))
    ; __append("\">")
    ; __append(escapeFn( post.title ))
    ; __append("</a></p>\r\n                    ")
    ;  }) 
    ; __append("\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    <p>No discussion posts yet.</p>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </div>\r\n            </div>\r\n\r\n            <div class=\"team-directory-actions\">\r\n              <a href=\"/account/team/")
    ; __append(escapeFn( member.id ))
    ; __append("\" class=\"btn btn-primary btn-sm\">View Account</a>\r\n              ")
    ;  if (member.isCurrentUser) { 
    ; __append("\r\n                <a href=\"/account/settings\" class=\"btn btn-secondary btn-sm\">Edit My Settings</a>\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n          </article>\r\n        ")
    ;  }) 
    ; __append("\r\n      </section>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <section class=\"account-directory-empty\">\r\n        <strong>No staff accounts are visible in this workspace scope.</strong>\r\n        <p>Switch locations if your team works across another property, or ask an admin to review staff city access.</p>\r\n      </section>\r\n    ")
    ;  } 
    ; __append("\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

},
  "admin/audit": function (locals, escapeFn, include, rethrow) {
var monitoringSnapshot = locals.monitoringSnapshot, accessAuditRows = locals.accessAuditRows, recentReservations = locals.recentReservations, contentActivity = locals.contentActivity;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Audit & Monitoring - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container audit-page\">\r\n    <div class=\"events-page-header\" style=\"margin-bottom:2rem;\">\r\n      <div>\r\n        <h1>Audit & Monitoring</h1>\r\n        <p style=\"color:var(--muted);margin-top:0.25rem;\">Review platform health, governance changes, and the latest high-signal guest and content activity.</p>\r\n      </div>\r\n      <a href=\"/admin\" class=\"btn btn-secondary btn-sm\">← Back to Workspace</a>\r\n    </div>\r\n\r\n    <section class=\"audit-summary-grid\">\r\n      <article class=\"audit-summary-card audit-summary-card-accent\">\r\n        <span class=\"audit-summary-label\">Reservations</span>\r\n        <strong>")
    ; __append(escapeFn( monitoringSnapshot.reservationTotal ))
    ; __append("</strong>\r\n        <p>Total reservation records currently stored across the platform.</p>\r\n      </article>\r\n      <article class=\"audit-summary-card\">\r\n        <span class=\"audit-summary-label\">Pending</span>\r\n        <strong>")
    ; __append(escapeFn( monitoringSnapshot.pendingReservations ))
    ; __append("</strong>\r\n        <p>Reservations still waiting on operational follow-through.</p>\r\n      </article>\r\n      <article class=\"audit-summary-card\">\r\n        <span class=\"audit-summary-label\">Confirmed</span>\r\n        <strong>")
    ; __append(escapeFn( monitoringSnapshot.confirmedReservations ))
    ; __append("</strong>\r\n        <p>Reservations already approved and moving toward fulfillment.</p>\r\n      </article>\r\n      <article class=\"audit-summary-card\">\r\n        <span class=\"audit-summary-label\">Access Changes</span>\r\n        <strong>")
    ; __append(escapeFn( monitoringSnapshot.weeklyAccessChanges ))
    ; __append("</strong>\r\n        <p>Governance changes recorded during the last 7 days.</p>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"audit-command-bar\">\r\n      <div>\r\n        <h2>Operational Monitoring</h2>\r\n        <p>The dashboard now prioritizes summary signals and recent high-value changes so admins can spot issues faster without loading oversized audit tables.</p>\r\n      </div>\r\n      <div class=\"audit-command-bar-notes\">\r\n        <span class=\"badge-status badge-admin\">Governance Feed</span>\r\n        <span class=\"badge-status badge-city\">Content Monitoring</span>\r\n        <span class=\"badge-status badge-approved\">Reservation Health</span>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"audit-layout\">\r\n      <div class=\"audit-column audit-column-primary\">\r\n        <article class=\"audit-panel\">\r\n          <div class=\"audit-panel-head\">\r\n            <div>\r\n              <h2>Monitoring Snapshot</h2>\r\n              <p>Current environment and throughput indicators for quick administrative review.</p>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"audit-monitor-grid\">\r\n            <div class=\"audit-monitor-card\">\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.contentUpdates24h ))
    ; __append("</strong>\r\n              <span>Content updates in the last 24 hours</span>\r\n            </div>\r\n            <div class=\"audit-monitor-card\">\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.enabledCities ))
    ; __append("</strong>\r\n              <span>Enabled cities currently available</span>\r\n            </div>\r\n            <div class=\"audit-monitor-card\">\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.port ))
    ; __append("</strong>\r\n              <span>Active application port</span>\r\n            </div>\r\n            <div class=\"audit-monitor-card\">\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.nodeEnv ))
    ; __append("</strong>\r\n              <span>Node environment</span>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"audit-status-grid\">\r\n            <div class=\"audit-status-pill\">\r\n              <span>Pending</span>\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.statusBreakdown.pending ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"audit-status-pill\">\r\n              <span>Confirmed</span>\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.statusBreakdown.confirmed ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"audit-status-pill\">\r\n              <span>Cancelled</span>\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.statusBreakdown.cancelled ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"audit-status-pill\">\r\n              <span>Completed</span>\r\n              <strong>")
    ; __append(escapeFn( monitoringSnapshot.statusBreakdown.completed ))
    ; __append("</strong>\r\n            </div>\r\n          </div>\r\n        </article>\r\n\r\n        <article class=\"audit-panel\">\r\n          <div class=\"audit-panel-head\">\r\n            <div>\r\n              <h2>Governance Audit Feed</h2>\r\n              <p>Latest access and policy changes affecting staff accounts and scope.</p>\r\n            </div>\r\n          </div>\r\n\r\n          ")
    ;  if (!accessAuditRows.length) { 
    ; __append("\r\n            <div class=\"audit-empty-state\">\r\n              <strong>No governance changes recorded yet.</strong>\r\n              <p class=\"muted-text\">Role and scope updates will appear here once administrators start modifying access.</p>\r\n            </div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"audit-feed-list\">\r\n              ")
    ;  accessAuditRows.forEach((entry) => { 
    ; __append("\r\n                <article class=\"audit-feed-item\">\r\n                  <div class=\"audit-feed-head\">\r\n                    <strong>")
    ; __append(escapeFn( entry.change_summary ))
    ; __append("</strong>\r\n                    <span>")
    ; __append(escapeFn( new Date(entry.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) ))
    ; __append("</span>\r\n                  </div>\r\n                  <p>Target: <strong>")
    ; __append(escapeFn( entry.target_username || 'Deleted account' ))
    ; __append("</strong> • Updated by <strong>")
    ; __append(escapeFn( entry.actor_username || 'Unknown admin' ))
    ; __append("</strong></p>\r\n                  <div class=\"audit-badge-row\">\r\n                    <span class=\"badge-status badge-")
    ; __append(escapeFn( entry.new_role || 'user' ))
    ; __append("\">")
    ; __append(escapeFn( entry.old_role || 'none' ))
    ; __append(" → ")
    ; __append(escapeFn( entry.new_role || 'none' ))
    ; __append("</span>\r\n                    ")
    ;  if (entry.old_primary_city || entry.new_primary_city) { 
    ; __append("\r\n                      <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( entry.old_primary_city || 'none' ))
    ; __append(" → ")
    ; __append(escapeFn( entry.new_primary_city || 'none' ))
    ; __append("</span>\r\n                    ")
    ;  } 
    ; __append("\r\n                    ")
    ;  if (entry.old_allowed_cities || entry.new_allowed_cities) { 
    ; __append("\r\n                      <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( entry.old_allowed_cities || 'none' ))
    ; __append(" → ")
    ; __append(escapeFn( entry.new_allowed_cities || 'none' ))
    ; __append("</span>\r\n                    ")
    ;  } 
    ; __append("\r\n                  </div>\r\n                </article>\r\n              ")
    ;  }) 
    ; __append("\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        </article>\r\n      </div>\r\n\r\n      <div class=\"audit-column audit-column-secondary\">\r\n        <article class=\"audit-panel\">\r\n          <div class=\"audit-panel-head\">\r\n            <div>\r\n              <h2>Recent Reservations</h2>\r\n              <p>The latest guest reservation activity, trimmed to the highest-signal recent records.</p>\r\n            </div>\r\n          </div>\r\n\r\n          ")
    ;  if (!recentReservations.length) { 
    ; __append("\r\n            <div class=\"audit-empty-state\">\r\n              <strong>No reservations on record.</strong>\r\n              <p class=\"muted-text\">Reservation activity will populate here once event bookings are created.</p>\r\n            </div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"audit-reservation-list\">\r\n              ")
    ;  recentReservations.forEach((entry) => { 
    ; __append("\r\n                <article class=\"audit-reservation-item\">\r\n                  <div class=\"audit-feed-head\">\r\n                    <strong>")
    ; __append(escapeFn( entry.event_title ))
    ; __append("</strong>\r\n                    <span>")
    ; __append(escapeFn( new Date(entry.reserved_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) ))
    ; __append("</span>\r\n                  </div>\r\n                  <p><strong>")
    ; __append(escapeFn( entry.guest_username ))
    ; __append("</strong> • ")
    ; __append(escapeFn( entry.guest_email ))
    ; __append("</p>\r\n                  <div class=\"audit-badge-row\">\r\n                    <span class=\"badge-status badge-")
    ; __append(escapeFn( entry.status ))
    ; __append("\">")
    ; __append(escapeFn( entry.status ))
    ; __append("</span>\r\n                    <span class=\"badge-status badge-user\">")
    ; __append(escapeFn( entry.guest_count ))
    ; __append(" guest")
    ; __append(escapeFn( entry.guest_count === 1 ? '' : 's' ))
    ; __append("</span>\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( new Date(entry.start_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ))
    ; __append("</span>\r\n                  </div>\r\n                  ")
    ;  if (entry.notes) { 
    ; __append("\r\n                    <p class=\"audit-feed-note\">")
    ; __append(escapeFn( entry.notes ))
    ; __append("</p>\r\n                  ")
    ;  } 
    ; __append("\r\n                </article>\r\n              ")
    ;  }) 
    ; __append("\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        </article>\r\n\r\n        <article class=\"audit-panel\">\r\n          <div class=\"audit-panel-head\">\r\n            <div>\r\n              <h2>Recent Content Activity</h2>\r\n              <p>Newest event and recommendation updates merged into one stream for quicker monitoring.</p>\r\n            </div>\r\n          </div>\r\n\r\n          ")
    ;  if (!contentActivity.length) { 
    ; __append("\r\n            <div class=\"audit-empty-state\">\r\n              <strong>No content activity yet.</strong>\r\n              <p class=\"muted-text\">Recently updated places and events will appear here.</p>\r\n            </div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"audit-feed-list\">\r\n              ")
    ;  contentActivity.forEach((entry) => { 
    ; __append("\r\n                <article class=\"audit-feed-item\">\r\n                  <div class=\"audit-feed-head\">\r\n                    <strong>")
    ; __append(escapeFn( entry.title ))
    ; __append("</strong>\r\n                    <span>")
    ; __append(escapeFn( new Date(entry.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) ))
    ; __append("</span>\r\n                  </div>\r\n                  <p><strong>")
    ; __append(escapeFn( entry.type === 'event' ? 'Event' : 'Recommendation' ))
    ; __append("</strong> • ")
    ; __append(escapeFn( entry.category ))
    ; __append(" • by <strong>")
    ; __append(escapeFn( entry.author ))
    ; __append("</strong></p>\r\n                  <div class=\"audit-badge-row\">\r\n                    ")
    ;  if (entry.sublabel) { 
    ; __append("\r\n                      <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( new Date(entry.sublabel).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ))
    ; __append("</span>\r\n                    ")
    ;  } 
    ; __append("\r\n                    <a href=\"")
    ; __append(escapeFn( entry.href ))
    ; __append("\" class=\"btn btn-secondary btn-sm\">Open</a>\r\n                  </div>\r\n                </article>\r\n              ")
    ;  }) 
    ; __append("\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        </article>\r\n      </div>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/diagnostics": function (locals, escapeFn, include, rethrow) {
var diagnostics = locals.diagnostics;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>System Diagnostics - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-admin\">\r\n    <section class=\"workspace-hero workspace-hero-admin\">\r\n      <div class=\"container\">\r\n        <h1>System Diagnostics</h1>\r\n        <p>Operational health overview for application runtime and database connectivity.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container workspace-grid\">\r\n      <div class=\"workspace-card\">\r\n        <h2>Service Status</h2>\r\n        <p><strong>")
    ; __append(escapeFn( diagnostics.serviceStatus ))
    ; __append("</strong></p>\r\n        <p>App Time: ")
    ; __append(escapeFn( diagnostics.appTime ))
    ; __append("</p>\r\n        <p>Uptime: ")
    ; __append(escapeFn( diagnostics.uptimeSeconds ))
    ; __append(" seconds</p>\r\n        <p>Node: ")
    ; __append(escapeFn( diagnostics.nodeVersion ))
    ; __append("</p>\r\n        <p>Environment: ")
    ; __append(escapeFn( diagnostics.environment ))
    ; __append("</p>\r\n      </div>\r\n\r\n      <div class=\"workspace-card ")
    ; __append(escapeFn( diagnostics.dbProbe.connected ? '' : 'workspace-card-critical' ))
    ; __append("\">\r\n        <h2>Database Connectivity</h2>\r\n        <p><strong>")
    ; __append(escapeFn( diagnostics.dbProbe.connected ? 'Connected' : 'Disconnected' ))
    ; __append("</strong></p>\r\n        <p>Latency: ")
    ; __append(escapeFn( diagnostics.dbProbe.latencyMs ))
    ; __append(" ms</p>\r\n        <p>Version: ")
    ; __append(escapeFn( diagnostics.dbProbe.version || 'Unavailable' ))
    ; __append("</p>\r\n        <p>Database Time: ")
    ; __append(escapeFn( diagnostics.dbProbe.dbTime || 'Unavailable' ))
    ; __append("</p>\r\n        ")
    ;  if (diagnostics.dbProbe.error) { 
    ; __append("\r\n          <p><strong>Error Code:</strong> ")
    ; __append(escapeFn( diagnostics.dbProbe.error.code || 'N/A' ))
    ; __append("</p>\r\n          <p><strong>Error Message:</strong> ")
    ; __append(escapeFn( diagnostics.dbProbe.error.message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Quick Links</h2>\r\n        <p>JSON Health Endpoint for automation and monitoring:</p>\r\n        <p><a href=\"/health\" class=\"btn btn-primary\">Open /health</a></p>\r\n        <p><a href=\"/admin\" class=\"btn btn-secondary\">Back to Admin Workspace</a></p>\r\n      </div>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/index": function (locals, escapeFn, include, rethrow) {
var user = locals.user, city = locals.city, canViewInviteCodes = locals.canViewInviteCodes, canViewTeamOperations = locals.canViewTeamOperations, canViewInactiveEvents = locals.canViewInactiveEvents, inactiveEventsCount = locals.inactiveEventsCount, canViewGovernance = locals.canViewGovernance, canViewPlatformConfig = locals.canViewPlatformConfig, canViewSuggestionInbox = locals.canViewSuggestionInbox, suggestionInboxCount = locals.suggestionInboxCount, recentSuggestionCount = locals.recentSuggestionCount, openTicketCount = locals.openTicketCount, canViewAudit = locals.canViewAudit, canViewDiagnostics = locals.canViewDiagnostics;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  ")
    ;  const workspaceRole = (user && user.role ? user.role.toLowerCase() : 'admin'); 
    ; __append("\r\n  ")
    ;  const isManagementWorkspace = workspaceRole === 'management'; 
    ; __append("\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( isManagementWorkspace ? 'Management Workspace' : 'Admin & Development Workspace' ))
    ; __append(" - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-admin\">\r\n    <section class=\"workspace-hero workspace-hero-admin\">\r\n      <div class=\"container\">\r\n        <h1>")
    ; __append(escapeFn( isManagementWorkspace ? 'Management Workspace' : 'Administrator & Development Interface' ))
    ; __append("</h1>\r\n        <p>")
    ; __append(escapeFn( isManagementWorkspace ? 'Employee operations and monitoring tools for day-to-day management.' : 'Employee operations plus platform controls, governance, and system maintenance tools.' ))
    ; __append("</p>\r\n        <div class=\"workspace-location-banner\">\r\n          <span class=\"badge-status badge-city\">Active Location: ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n          <span class=\"workspace-location-copy\">Boards and staff tools are currently scoped to this property.</span>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container workspace-grid\">\r\n      ")
    ;  if (canViewInviteCodes) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Staff Invite Links</h2>\r\n        <p>Generate and manage onboarding invite links with account-type selection.</p>\r\n        <a href=\"/admin/invite-codes\" class=\"btn btn-danger\">Open Invite Link Manager</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (canViewTeamOperations) { 
    ; __append("\r\n      <div class=\"workspace-card\">\r\n        <h2>Team Operations</h2>\r\n        <p>View the employee workspace and oversee concierge workflows across shifts.</p>\r\n        <a href=\"/employee\" class=\"btn btn-secondary\">Employee Workspace</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Discussion Board</h2>\r\n        <p>Share updates and discuss recommendations with the team.</p>\r\n        <a href=\"/discussion\" class=\"btn btn-secondary\">Open Discussion Board</a>\r\n      </div>\r\n\r\n      ")
    ;  if (canViewInactiveEvents) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Inactive Events</h2>\r\n        <p>Review hidden or completed events, reactivate them for editing, or delete them permanently.</p>\r\n        <p>\r\n          <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( inactiveEventsCount || 0 ))
    ; __append(" inactive in ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n        </p>\r\n        <a href=\"/events/admin/inactive\" class=\"btn btn-danger\">Open Inactive Events</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (workspaceRole === 'admin' && canViewGovernance) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>User Governance</h2>\r\n        <p>Review account roles, access scopes, and policy compliance for all users.</p>\r\n        <a href=\"/admin/users\" class=\"btn btn-danger\">Open Governance</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (workspaceRole === 'admin' && canViewPlatformConfig) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Platform Configuration</h2>\r\n        <p>Review platform settings, city configuration, and system documentation.</p>\r\n        <a href=\"/admin/platform-config\" class=\"btn btn-danger\">Open Platform Config</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (canViewSuggestionInbox) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Suggestion Inbox</h2>\r\n        <p>Review all submitted platform suggestions from guests and staff.</p>\r\n        <p>\r\n          <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( suggestionInboxCount || 0 ))
    ; __append(" total suggestions</span>\r\n          <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( recentSuggestionCount || 0 ))
    ; __append(" in last 7 days</span>\r\n        </p>\r\n        <a href=\"/admin/suggestions\" class=\"btn btn-danger\">Open Suggestion Inbox</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Staff Ticket Board</h2>\r\n        <p>Review and triage tickets submitted by employees for Management, Maintenance, and IT.</p>\r\n        ")
    ;  if (typeof openTicketCount !== 'undefined' && openTicketCount > 0) { 
    ; __append("\r\n          <p><span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( openTicketCount ))
    ; __append(" open ticket")
    ; __append(escapeFn( openTicketCount !== 1 ? 's' : '' ))
    ; __append("</span></p>\r\n        ")
    ;  } 
    ; __append("\r\n        <a href=\"/admin/tickets\" class=\"btn btn-danger\">Open Ticket Board</a>\r\n      </div>\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Browse Recommendations</h2>\r\n        <p>Explore all approved recommendations for this property — restaurants, bars, entertainment, and more.</p>\r\n        <a href=\"/places\" class=\"btn btn-secondary\">Browse Recommendations</a>\r\n      </div>\r\n\r\n      ")
    ;  if (workspaceRole === 'admin' && canViewAudit) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>Audit & Monitoring</h2>\r\n        <p>Track reservations, event changes, and recommendation activity across the platform.</p>\r\n        <a href=\"/admin/audit\" class=\"btn btn-danger\">Open Audit View</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (workspaceRole === 'admin' && canViewDiagnostics) { 
    ; __append("\r\n      <div class=\"workspace-card workspace-card-critical\">\r\n        <h2>System Diagnostics</h2>\r\n        <p>Check application and database health, uptime, and connectivity diagnostics.</p>\r\n        <a href=\"/admin/diagnostics\" class=\"btn btn-danger\">Open Diagnostics</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/invite-codes": function (locals, escapeFn, include, rethrow) {
var user = locals.user, message = locals.message, newInviteCode = locals.newInviteCode, inviteCodes = locals.inviteCodes;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Invite Code Manager - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-admin\">\r\n    <section class=\"workspace-hero workspace-hero-admin\">\r\n      <div class=\"container\">\r\n        <h1>Employee Invite Code Manager</h1>\r\n        <p>Create and track invite codes for new employee onboarding.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container\">\r\n      <div class=\"workspace-card workspace-card-critical\" style=\"max-width: 860px; margin: 0 auto;\">\r\n        <div style=\"display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px;\">\r\n          <h2 style=\"margin:0;\">Generate Invite Code</h2>\r\n          <a href=\"/admin\" class=\"btn btn-secondary btn-sm\">Back to ")
    ; __append(escapeFn( user && user.role === 'management' ? 'Management' : 'Admin' ))
    ; __append(" Workspace</a>\r\n        </div>\r\n\r\n        ")
    ;  if (message) { 
    ; __append("\r\n          <p class=\"admin-inline-message\">")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (newInviteCode) { 
    ; __append("\r\n          <div class=\"admin-invite-highlight\">\r\n            <span>New Code</span>\r\n            <strong>")
    ; __append(escapeFn( newInviteCode ))
    ; __append("</strong>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <form method=\"POST\" action=\"/admin/invite-codes\" class=\"admin-invite-form\">\r\n          <label for=\"inviteRole\">Access Level</label>\r\n          <select id=\"inviteRole\" name=\"inviteRole\" required>\r\n            <option value=\"employee\" selected>Employee</option>\r\n            <option value=\"admin\">Management / Admin</option>\r\n          </select>\r\n\r\n          <label for=\"maxUses\">Max Uses</label>\r\n          <input id=\"maxUses\" name=\"maxUses\" type=\"number\" min=\"1\" max=\"100\" value=\"1\" required>\r\n\r\n          <label for=\"expiresInDays\">Expires In (Days)</label>\r\n          <input id=\"expiresInDays\" name=\"expiresInDays\" type=\"number\" min=\"1\" max=\"365\" value=\"14\">\r\n\r\n          <button type=\"submit\" class=\"btn btn-danger\">Generate Invite Code</button>\r\n        </form>\r\n\r\n        <div class=\"admin-invite-list\">\r\n          <h3>Recent Codes</h3>\r\n          ")
    ;  if (inviteCodes && inviteCodes.length > 0) { 
    ; __append("\r\n            ")
    ;  inviteCodes.forEach(code => { 
    ; __append("\r\n              <div class=\"admin-invite-item\">\r\n                <div>\r\n                  <strong>")
    ; __append(escapeFn( code.code ))
    ; __append("</strong>\r\n                  <p>By ")
    ; __append(escapeFn( code.created_by_username ))
    ; __append(" • Uses ")
    ; __append(escapeFn( code.used_count ))
    ; __append("/")
    ; __append(escapeFn( code.max_uses ))
    ; __append("</p>\r\n                  ")
    ;  if (code.expires_at) { 
    ; __append("\r\n                    <p>Expires ")
    ; __append(escapeFn( new Date(code.expires_at).toLocaleDateString() ))
    ; __append("</p>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n                <div style=\"display:flex; flex-direction:column; gap:6px; align-items:flex-end;\">\r\n                  <span class=\"badge-status ")
    ; __append(escapeFn( (code.invite_role || 'employee') === 'admin' ? 'badge-admin' : 'badge-employee' ))
    ; __append("\">\r\n                    ")
    ; __append(escapeFn( (code.invite_role || 'employee') === 'admin' ? 'Admin' : 'Employee' ))
    ; __append("\r\n                  </span>\r\n                  <span class=\"badge-status ")
    ; __append(escapeFn( code.is_active ? 'badge-confirmed' : 'badge-cancelled' ))
    ; __append("\">\r\n                    ")
    ; __append(escapeFn( code.is_active ? 'Active' : 'Used' ))
    ; __append("\r\n                  </span>\r\n                </div>\r\n              </div>\r\n            ")
    ;  }); 
    ; __append("\r\n          ")
    ;  } else { 
    ; __append("\r\n            <p class=\"muted-text\">No invite codes generated yet.</p>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/platform-config": function (locals, escapeFn, include, rethrow) {
var message = locals.message, error = locals.error, platform = locals.platform, enabledCities = locals.enabledCities, cities = locals.cities, isDemoUser = locals.isDemoUser, systemSnapshot = locals.systemSnapshot;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Platform Configuration - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container platform-config-page\">\r\n    <section class=\"platform-config-hero\">\r\n      <div class=\"platform-config-hero-copy\">\r\n        <p class=\"platform-config-eyebrow\">Admin Control Surface</p>\r\n        <h1>Platform Configuration</h1>\r\n        <p>Manage workspace identity, location routing, and system-level settings from one dashboard.</p>\r\n        <div class=\"platform-config-quick-links\">\r\n          <a href=\"#platformSettings\" class=\"support-chip\">Platform Settings</a>\r\n          <a href=\"#cityConfiguration\" class=\"support-chip\">City Configuration</a>\r\n          <a href=\"#systemSnapshot\" class=\"support-chip\">System Snapshot</a>\r\n          <a href=\"#systemDocumentation\" class=\"support-chip\">Documentation</a>\r\n        </div>\r\n      </div>\r\n      <div class=\"platform-config-hero-actions\">\r\n        <a href=\"/admin\" class=\"btn btn-secondary\">← Back to Workspace</a>\r\n      </div>\r\n    </section>\r\n\r\n    ")
    ;  if (message) { 
    ; __append("\r\n      <div class=\"alert alert-success\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  if (error) { 
    ; __append("\r\n      <div class=\"alert alert-error\">")
    ; __append(escapeFn( error ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <section class=\"platform-config-summary-grid\">\r\n      <article class=\"platform-summary-pill\">\r\n        <span>Access</span>\r\n        <strong>Admin Only</strong>\r\n      </article>\r\n      <article class=\"platform-summary-pill\">\r\n        <span>Default City</span>\r\n        <strong>")
    ; __append(escapeFn( platform.default_city ))
    ; __append("</strong>\r\n      </article>\r\n      <article class=\"platform-summary-pill\">\r\n        <span>Enabled Locations</span>\r\n        <strong>")
    ; __append(escapeFn( enabledCities.length ))
    ; __append("</strong>\r\n      </article>\r\n      <article class=\"platform-summary-pill\">\r\n        <span>Support Email</span>\r\n        <strong>")
    ; __append(escapeFn( platform.support_email ))
    ; __append("</strong>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"platform-config-layout\">\r\n      <article class=\"platform-config-panel\" id=\"platformSettings\">\r\n        <div class=\"platform-config-panel-head\">\r\n          <div>\r\n            <h2>Platform Settings</h2>\r\n            <p>These values are live. The platform name updates the navigation brand, and the default city becomes the fallback session location when no city is selected.</p>\r\n          </div>\r\n        </div>\r\n\r\n        <form method=\"POST\" action=\"/admin/platform-config/platform\" class=\"platform-config-form\">\r\n          <div class=\"platform-config-form-grid\">\r\n            <label class=\"platform-config-field platform-config-field-wide\">\r\n              <span>Platform Name</span>\r\n              <input type=\"text\" name=\"platform_name\" class=\"form-control\" value=\"")
    ; __append(escapeFn( platform.platform_name ))
    ; __append("\" maxlength=\"120\" required>\r\n            </label>\r\n\r\n            <label class=\"platform-config-field\">\r\n              <span>Support Email</span>\r\n              <input type=\"email\" name=\"support_email\" class=\"form-control\" value=\"")
    ; __append(escapeFn( platform.support_email ))
    ; __append("\" maxlength=\"120\" required>\r\n            </label>\r\n\r\n            <label class=\"platform-config-field\">\r\n              <span>Default City</span>\r\n              <select name=\"default_city\" class=\"form-control\" required>\r\n                ")
    ;  cities.forEach(cityOption => { 
    ; __append("\r\n                  <option value=\"")
    ; __append(escapeFn( cityOption.city ))
    ; __append("\" ")
    ; __append(escapeFn( platform.default_city === cityOption.city ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( cityOption.city ))
    ; __append(" — ")
    ; __append(escapeFn( cityOption.display_name ))
    ; __append("</option>\r\n                ")
    ;  }) 
    ; __append("\r\n              </select>\r\n            </label>\r\n          </div>\r\n\r\n          <div class=\"platform-config-actions\">\r\n            <p class=\"muted-text\">If the selected default city is later disabled, the system automatically falls back to the first enabled property.</p>\r\n            ")
    ;  if (!isDemoUser) { 
    ; __append("<button type=\"submit\" class=\"btn btn-primary\">Save Platform Settings</button>")
    ;  } else { 
    ; __append("<p class=\"muted-text\">Saving is disabled in demo mode.</p>")
    ;  } 
    ; __append("\r\n          </div>\r\n        </form>\r\n      </article>\r\n\r\n      <article class=\"platform-config-panel\" id=\"cityConfiguration\">\r\n        <div class=\"platform-config-panel-head\">\r\n          <div>\r\n            <h2>City Configuration</h2>\r\n            <p>Enabled cities are available in login routing and the location switcher. Disabled cities are removed from active workspace selection.</p>\r\n          </div>\r\n        </div>\r\n\r\n        <form method=\"POST\" action=\"/admin/platform-config/cities\" class=\"platform-config-form\">\r\n          <div class=\"platform-config-city-grid\">\r\n            ")
    ;  cities.forEach(cityOption => { 
    ; __append("\r\n              ")
    ;  const citySlug = cityOption.city.toLowerCase(); 
    ; __append("\r\n              <section class=\"platform-city-card ")
    ; __append(escapeFn( cityOption.is_enabled ? 'platform-city-card-enabled' : 'platform-city-card-disabled' ))
    ; __append("\">\r\n                <div class=\"platform-city-card-head\">\r\n                  <div>\r\n                    <h3>")
    ; __append(escapeFn( cityOption.city ))
    ; __append("</h3>\r\n                    <p>")
    ; __append(escapeFn( cityOption.display_name ))
    ; __append("</p>\r\n                  </div>\r\n                  <span class=\"badge-status ")
    ; __append(escapeFn( cityOption.is_enabled ? 'badge-approved' : 'badge-draft' ))
    ; __append("\">")
    ; __append(escapeFn( cityOption.is_enabled ? 'enabled' : 'disabled' ))
    ; __append("</span>\r\n                </div>\r\n\r\n                <label>\r\n                  <span>Property Label</span>\r\n                  <input type=\"text\" name=\"")
    ; __append(escapeFn( citySlug ))
    ; __append("_display_name\" class=\"form-control\" value=\"")
    ; __append(escapeFn( cityOption.display_name ))
    ; __append("\" maxlength=\"80\" required>\r\n                </label>\r\n\r\n                <label class=\"platform-config-toggle\">\r\n                  <input type=\"checkbox\" name=\"")
    ; __append(escapeFn( citySlug ))
    ; __append("_is_enabled\" value=\"1\" ")
    ; __append(escapeFn( cityOption.is_enabled ? 'checked' : '' ))
    ; __append(">\r\n                  <span>Enable for routing and location switcher</span>\r\n                </label>\r\n              </section>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n\r\n          <div class=\"platform-config-actions\">\r\n            <p class=\"muted-text\">At least one city must stay enabled at all times.</p>\r\n            ")
    ;  if (!isDemoUser) { 
    ; __append("<button type=\"submit\" class=\"btn btn-primary\">Save City Configuration</button>")
    ;  } else { 
    ; __append("<p class=\"muted-text\">Saving is disabled in demo mode.</p>")
    ;  } 
    ; __append("\r\n          </div>\r\n        </form>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"platform-config-layout\">\r\n      <article class=\"platform-config-panel\" id=\"systemSnapshot\">\r\n        <div class=\"platform-config-panel-head\">\r\n          <div>\r\n            <h2>System Snapshot</h2>\r\n            <p>Current operational totals and runtime context for this deployment.</p>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"platform-stats-grid\">\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.usersTotal ))
    ; __append("</strong>\r\n            <span>Total Accounts</span>\r\n          </div>\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.staffTotal ))
    ; __append("</strong>\r\n            <span>Staff Accounts</span>\r\n          </div>\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.recommendationTotal ))
    ; __append("</strong>\r\n            <span>Recommendations</span>\r\n          </div>\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.eventTotal ))
    ; __append("</strong>\r\n            <span>Events</span>\r\n          </div>\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.discussionTotal ))
    ; __append("</strong>\r\n            <span>Discussion Posts</span>\r\n          </div>\r\n          <div class=\"platform-stat-card\">\r\n            <strong>")
    ; __append(escapeFn( systemSnapshot.port ))
    ; __append("</strong>\r\n            <span>Active Port</span>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"platform-config-runtime-meta\">\r\n          <span class=\"badge-status badge-user\">Environment: ")
    ; __append(escapeFn( systemSnapshot.nodeEnv ))
    ; __append("</span>\r\n          ")
    ;  if (platform.updated_at) { 
    ; __append("\r\n            <span class=\"badge-status badge-city-soft\">Last Updated: ")
    ; __append(escapeFn( new Date(platform.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) ))
    ; __append("</span>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n      </article>\r\n\r\n      <article class=\"platform-config-panel\" id=\"systemDocumentation\">\r\n        <div class=\"platform-config-panel-head\">\r\n          <div>\r\n            <h2>System Documentation</h2>\r\n            <p>Operational reference for what this screen controls today.</p>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"platform-doc-list\">\r\n          <div class=\"platform-doc-item\">\r\n            <h3>Platform Identity</h3>\r\n            <p>The platform name is shown in the primary navigation. The support email serves as the current system contact reference for administrators.</p>\r\n          </div>\r\n          <div class=\"platform-doc-item\">\r\n            <h3>Default City</h3>\r\n            <p>The configured default city is used whenever a session does not already have a valid active location.</p>\r\n          </div>\r\n          <div class=\"platform-doc-item\">\r\n            <h3>Enabled Cities</h3>\r\n            <p>Only enabled cities appear in login location selection and the workspace location switcher. Disabled cities remain in the database but cannot be actively selected.</p>\r\n          </div>\r\n          <div class=\"platform-doc-item\">\r\n            <h3>Scope Boundaries</h3>\r\n            <p>This screen currently governs platform identity and location availability. Content moderation, user access, and audits remain in their dedicated admin tools.</p>\r\n          </div>\r\n        </div>\r\n      </article>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

},
  "admin/shift-notes-archive": function (locals, escapeFn, include, rethrow) {
var message = locals.message, archivedNotes = locals.archivedNotes;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Shift Notes Archive - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-admin\">\r\n    <section class=\"workspace-hero workspace-hero-admin\">\r\n      <div class=\"container\">\r\n        <h1>Shift Notes Archive</h1>\r\n        <p>Archived handoff notes resolved by staff or automatically archived after 24 hours.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container\">\r\n      <section class=\"workspace-card\">\r\n        <div class=\"shift-notes-list-head\">\r\n          <h2>Archived Notes</h2>\r\n          <a href=\"/employee/shift-notes\" class=\"btn btn-secondary btn-sm\">Back to Active Notes</a>\r\n        </div>\r\n\r\n        ")
    ;  if (message) { 
    ; __append("\r\n          <p class=\"admin-inline-message\">")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (archivedNotes && archivedNotes.length > 0) { 
    ; __append("\r\n          <div class=\"shift-notes-list\">\r\n            ")
    ;  archivedNotes.forEach(note => { 
    ; __append("\r\n              <article class=\"shift-note-item shift-note-item-archived\">\r\n                <div class=\"shift-note-head\">\r\n                  <div>\r\n                    <strong>")
    ; __append(escapeFn( new Date(note.shift_date).toLocaleDateString() ))
    ; __append(" • ")
    ; __append(escapeFn( note.shift_label.charAt(0).toUpperCase() + note.shift_label.slice(1) ))
    ; __append("</strong>\r\n                    <p>Created by ")
    ; __append(escapeFn( note.created_by_username ))
    ; __append(" • Archived ")
    ; __append(escapeFn( new Date(note.archived_at).toLocaleString() ))
    ; __append("</p>\r\n                  </div>\r\n                  <div class=\"shift-note-badges\">\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( note.note_category === 'guest' ? 'badge-note-guest' : note.note_category === 'management_maintenance' ? 'badge-note-management' : 'badge-note-employees' ))
    ; __append("\">\r\n                      ")
    ; __append(escapeFn( note.note_category === 'guest' ? 'Guest' : note.note_category === 'management_maintenance' ? 'Mgmt/Maintenance' : 'Employees' ))
    ; __append("\r\n                    </span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( note.priority === 'urgent' ? 'badge-cancelled' : 'badge-confirmed' ))
    ; __append("\">")
    ; __append(escapeFn( note.priority ))
    ; __append("</span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( note.archived_reason === 'resolved' ? 'badge-confirmed' : 'badge-pending' ))
    ; __append("\">\r\n                      ")
    ; __append(escapeFn( note.archived_reason === 'resolved' ? 'Resolved' : 'Auto-Archived' ))
    ; __append("\r\n                    </span>\r\n                  </div>\r\n                </div>\r\n\r\n                <p class=\"shift-note-body\">")
    ; __append(escapeFn( note.note_text ))
    ; __append("</p>\r\n\r\n                ")
    ;  if (note.archived_reason === 'resolved' && note.resolved_by_username) { 
    ; __append("\r\n                  <p class=\"shift-note-meta\">Resolved by <strong>")
    ; __append(escapeFn( note.resolved_by_username ))
    ; __append("</strong></p>\r\n                ")
    ;  } 
    ; __append("\r\n              </article>\r\n            ")
    ;  }); 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">No archived notes yet.</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/suggestions": function (locals, escapeFn, include, rethrow) {
var sectionTitle = locals.sectionTitle, sectionIntro = locals.sectionIntro, totalSuggestions = locals.totalSuggestions, statusCounts = locals.statusCounts, loadedSuggestions = locals.loadedSuggestions, sectionCounts = locals.sectionCounts, message = locals.message, suggestions = locals.suggestions, formatDateTime = locals.formatDateTime, activeSection = locals.activeSection;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Suggestion Inbox - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container queue-page\">\r\n    <div class=\"queue-page-header\">\r\n      <div>\r\n        <h1>Suggestion Inbox - ")
    ; __append(escapeFn( sectionTitle ))
    ; __append("</h1>\r\n        <p class=\"queue-page-intro\">")
    ; __append(escapeFn( sectionIntro ))
    ; __append("</p>\r\n        <p>\r\n          <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( Number(totalSuggestions || 0) ))
    ; __append(" submitted</span>\r\n          <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( Number(statusCounts?.pending || 0) ))
    ; __append(" pending</span>\r\n          <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( Number(statusCounts?.approved || 0) ))
    ; __append(" approved</span>\r\n          <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( Number(statusCounts?.completed || 0) ))
    ; __append(" completed</span>\r\n          <span class=\"badge-status badge-rejected\">")
    ; __append(escapeFn( Number(statusCounts?.rejected || 0) ))
    ; __append(" rejected</span>\r\n          <span class=\"badge-status badge-draft\">")
    ; __append(escapeFn( Number(statusCounts?.archived || 0) ))
    ; __append(" archived</span>\r\n          <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( Number(loadedSuggestions || 0) ))
    ; __append(" loaded in this view</span>\r\n        </p>\r\n        <p>\r\n          <a href=\"/admin/suggestions/open\" class=\"btn btn-link\">Open (")
    ; __append(escapeFn( Number(sectionCounts?.open || 0) ))
    ; __append(")</a>\r\n          <a href=\"/admin/suggestions/approved\" class=\"btn btn-link\">Approved (")
    ; __append(escapeFn( Number(sectionCounts?.approved || 0) ))
    ; __append(")</a>\r\n          <a href=\"/admin/suggestions/completed\" class=\"btn btn-link\">Completed (")
    ; __append(escapeFn( Number(sectionCounts?.completed || 0) ))
    ; __append(")</a>\r\n          <a href=\"/admin/suggestions/archived\" class=\"btn btn-link\">Archived (")
    ; __append(escapeFn( Number(sectionCounts?.archived || 0) ))
    ; __append(")</a>\r\n        </p>\r\n      </div>\r\n      <a href=\"/admin\" class=\"btn btn-secondary\">← Back to Workspace</a>\r\n    </div>\r\n\r\n    ")
    ;  if (message) { 
    ; __append("\r\n      <div class=\"alert alert-success\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  if (!suggestions || !suggestions.length) { 
    ; __append("\r\n      <section class=\"empty-state\">\r\n        <p>No suggestions found in this section.</p>\r\n      </section>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <section class=\"queue-list\" style=\"margin-bottom: 2rem;\">\r\n        ")
    ;  suggestions.forEach((entry) => { 
    ; __append("\r\n          ")
    ;  const suggestionStatus = (entry.request_status || 'pending').toLowerCase(); 
    ; __append("\r\n          ")
    ;  const statusBadgeClass = suggestionStatus === 'approved'
               ? (entry.completed_at ? 'badge-approved' : 'badge-pending')
               : (suggestionStatus === 'rejected' ? 'badge-rejected' : (suggestionStatus === 'archived' ? 'badge-draft' : 'badge-pending')); 
    ; __append("\r\n          <article class=\"queue-card\">\r\n            <div class=\"queue-card-head\">\r\n              <div>\r\n                <h2>")
    ; __append(escapeFn( entry.subject || 'Untitled suggestion' ))
    ; __append("</h2>\r\n                <div class=\"queue-card-meta\">\r\n                  <span><strong>From:</strong> ")
    ; __append(escapeFn( entry.name || 'Anonymous' ))
    ; __append("</span>\r\n                  <span><strong>Email:</strong> ")
    ; __append(escapeFn( entry.email || 'Not provided' ))
    ; __append("</span>\r\n                  <span><strong>City:</strong> ")
    ; __append(escapeFn( entry.city || 'Unknown' ))
    ; __append("</span>\r\n                  <span><strong>Submitted:</strong> ")
    ; __append(escapeFn( formatDateTime(entry.created_at) ))
    ; __append("</span>\r\n                  ")
    ;  if (entry.account_username) { 
    ; __append("\r\n                    <span class=\"badge-status badge-city-soft\">Account: ")
    ; __append(escapeFn( entry.account_username ))
    ; __append(" (")
    ; __append(escapeFn( entry.account_role || 'user' ))
    ; __append(")</span>\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    <span class=\"badge-status badge-draft\">Guest / Anonymous</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                  ")
    ;  if (entry.reviewed_by_username) { 
    ; __append("\r\n                    <span><strong>Reviewed by:</strong> ")
    ; __append(escapeFn( entry.reviewed_by_username ))
    ; __append("</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                  ")
    ;  if (entry.reviewed_at) { 
    ; __append("\r\n                    <span><strong>Reviewed at:</strong> ")
    ; __append(escapeFn( formatDateTime(entry.reviewed_at) ))
    ; __append("</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                  ")
    ;  if (entry.completed_by_username) { 
    ; __append("\r\n                    <span><strong>Completed by:</strong> ")
    ; __append(escapeFn( entry.completed_by_username ))
    ; __append("</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                  ")
    ;  if (entry.completed_at) { 
    ; __append("\r\n                    <span><strong>Completed at:</strong> ")
    ; __append(escapeFn( formatDateTime(entry.completed_at) ))
    ; __append("</span>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </div>\r\n              <span class=\"badge-status ")
    ; __append(escapeFn( statusBadgeClass ))
    ; __append("\">")
    ; __append(escapeFn( (suggestionStatus === 'approved' && entry.completed_at) ? 'completed' : suggestionStatus ))
    ; __append("</span>\r\n            </div>\r\n\r\n            <p style=\"white-space: pre-wrap;\">")
    ; __append(escapeFn( entry.message ))
    ; __append("</p>\r\n\r\n            ")
    ;  if (entry.status_note) { 
    ; __append("\r\n              <p><strong>Review note:</strong> ")
    ; __append(escapeFn( entry.status_note ))
    ; __append("</p>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            ")
    ;  if (activeSection === 'open') { 
    ; __append("\r\n              <div class=\"queue-card-actions\">\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/approve\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"status_note\" value=\"Approved in suggestion inbox\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-primary btn-sm\">Approve</button>\r\n                </form>\r\n\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/reject\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"status_note\" value=\"Rejected in suggestion inbox\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-danger btn-sm\">Reject</button>\r\n                </form>\r\n\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/archive\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"status_note\" value=\"Archived in suggestion inbox\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Archive</button>\r\n                </form>\r\n              </div>\r\n            ")
    ;  } else if (activeSection === 'approved') { 
    ; __append("\r\n              <div class=\"queue-card-actions\">\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/complete\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-primary btn-sm\">Mark Completed</button>\r\n                </form>\r\n\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/archive\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"status_note\" value=\"Archived in suggestion inbox\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Archive</button>\r\n                </form>\r\n              </div>\r\n            ")
    ;  } else if (activeSection === 'completed') { 
    ; __append("\r\n              <div class=\"queue-card-actions\">\r\n                <form method=\"POST\" action=\"/admin/suggestions/")
    ; __append(escapeFn( entry.id ))
    ; __append("/archive\" class=\"queue-inline-form\">\r\n                  <input type=\"hidden\" name=\"status_note\" value=\"Archived in suggestion inbox\">\r\n                  <input type=\"hidden\" name=\"section\" value=\"")
    ; __append(escapeFn( activeSection ))
    ; __append("\">\r\n                  <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Archive</button>\r\n                </form>\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n          </article>\r\n        ")
    ;  }) 
    ; __append("\r\n      </section>\r\n    ")
    ;  } 
    ; __append("\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/tickets": function (locals, escapeFn, include, rethrow) {
var openCount = locals.openCount, filterDept = locals.filterDept, filterStatus = locals.filterStatus, message = locals.message, tickets = locals.tickets;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Ticket Board - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-admin\">\r\n    <section class=\"workspace-hero workspace-hero-admin\">\r\n      <div class=\"container\">\r\n        <h1>Staff Ticket Board</h1>\r\n        <p>Review, triage, and resolve tickets submitted by employees for Management, Maintenance, and IT.</p>\r\n        ")
    ;  if (openCount > 0) { 
    ; __append("\r\n          <div class=\"workspace-location-banner\">\r\n            <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( openCount ))
    ; __append(" open ticket")
    ; __append(escapeFn( openCount !== 1 ? 's' : '' ))
    ; __append("</span>\r\n            <span class=\"workspace-location-copy\">Awaiting action at this property.</span>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container\">\r\n      <section class=\"workspace-card\">\r\n        <div class=\"shift-notes-list-head\">\r\n          <h2>All Tickets</h2>\r\n          <a href=\"/employee/tickets\" class=\"btn btn-secondary btn-sm\">My Tickets</a>\r\n        </div>\r\n\r\n        <!-- Filters -->\r\n        <form method=\"GET\" action=\"/admin/tickets\" class=\"ticket-filters\">\r\n          <div class=\"ticket-filter-row\">\r\n            <div class=\"form-group\">\r\n              <label for=\"filterDept\">Department</label>\r\n              <select id=\"filterDept\" name=\"dept\">\r\n                <option value=\"\">All Departments</option>\r\n                <option value=\"management\" ")
    ; __append(escapeFn( filterDept === 'management' ? 'selected' : '' ))
    ; __append(">Management</option>\r\n                <option value=\"maintenance\" ")
    ; __append(escapeFn( filterDept === 'maintenance' ? 'selected' : '' ))
    ; __append(">Maintenance</option>\r\n                <option value=\"it\" ")
    ; __append(escapeFn( filterDept === 'it' ? 'selected' : '' ))
    ; __append(">IT</option>\r\n              </select>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"filterStatus\">Status</label>\r\n              <select id=\"filterStatus\" name=\"status\">\r\n                <option value=\"\">All Statuses</option>\r\n                <option value=\"open\" ")
    ; __append(escapeFn( filterStatus === 'open' ? 'selected' : '' ))
    ; __append(">Open</option>\r\n                <option value=\"in_progress\" ")
    ; __append(escapeFn( filterStatus === 'in_progress' ? 'selected' : '' ))
    ; __append(">In Progress</option>\r\n                <option value=\"resolved\" ")
    ; __append(escapeFn( filterStatus === 'resolved' ? 'selected' : '' ))
    ; __append(">Resolved</option>\r\n                <option value=\"closed\" ")
    ; __append(escapeFn( filterStatus === 'closed' ? 'selected' : '' ))
    ; __append(">Closed</option>\r\n              </select>\r\n            </div>\r\n            <button type=\"submit\" class=\"btn btn-secondary btn-sm ticket-filter-btn\">Filter</button>\r\n            <a href=\"/admin/tickets\" class=\"btn btn-ghost btn-sm\">Reset</a>\r\n          </div>\r\n        </form>\r\n\r\n        ")
    ;  if (message) { 
    ; __append("\r\n          <p class=\"admin-inline-message\">")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (tickets && tickets.length > 0) { 
    ; __append("\r\n          <div class=\"shift-notes-list\">\r\n            ")
    ;  tickets.forEach(ticket => { 
    ; __append("\r\n              ")
    ;  const initials = (ticket.created_by_username || '')
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('') || '?'; 
    ; __append("\r\n              ")
    ;  const deptLabel = ticket.department === 'it' ? 'IT' : ticket.department.charAt(0).toUpperCase() + ticket.department.slice(1); 
    ; __append("\r\n\r\n              <article class=\"shift-note-item\">\r\n                <div class=\"shift-note-head\">\r\n                  <div>\r\n                    <strong>")
    ; __append(escapeFn( ticket.title ))
    ; __append("</strong>\r\n                    <p>Submitted by <strong>")
    ; __append(escapeFn( ticket.created_by_username ))
    ; __append("</strong> &bull; ")
    ; __append(escapeFn( new Date(ticket.created_at).toLocaleString() ))
    ; __append("</p>\r\n                  </div>\r\n                  <div class=\"shift-note-badges\">\r\n                    <span class=\"badge-status ticket-badge-dept-")
    ; __append(escapeFn( ticket.department ))
    ; __append("\">")
    ; __append(escapeFn( deptLabel ))
    ; __append("</span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( ticket.priority === 'urgent' ? 'badge-cancelled' : 'badge-confirmed' ))
    ; __append("\">")
    ; __append(escapeFn( ticket.priority ))
    ; __append("</span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( ticket.status === 'open' ? 'badge-pending' : ticket.status === 'in_progress' ? 'badge-city' : 'badge-approved' ))
    ; __append("\">\r\n                      ")
    ; __append(escapeFn( ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) ))
    ; __append("\r\n                    </span>\r\n                  </div>\r\n                </div>\r\n\r\n                <p class=\"shift-note-body\">")
    ; __append(escapeFn( ticket.description ))
    ; __append("</p>\r\n\r\n                ")
    ;  if (ticket.resolution_note) { 
    ; __append("\r\n                  <p class=\"shift-note-meta ticket-resolution-note\"><strong>Resolution:</strong> ")
    ; __append(escapeFn( ticket.resolution_note ))
    ; __append("</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                ")
    ;  if (ticket.resolved_by_username && ticket.resolved_at) { 
    ; __append("\r\n                  <p class=\"shift-note-meta\">Resolved by <strong>")
    ; __append(escapeFn( ticket.resolved_by_username ))
    ; __append("</strong> &bull; ")
    ; __append(escapeFn( new Date(ticket.resolved_at).toLocaleString() ))
    ; __append("</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <div class=\"shift-note-actions\">\r\n                  <form method=\"POST\" action=\"/admin/tickets/")
    ; __append(escapeFn( ticket.id ))
    ; __append("/status\" class=\"ticket-status-form\">\r\n                    <select name=\"status\" class=\"ticket-inline-select\" aria-label=\"Update status\">\r\n                      <option value=\"open\" ")
    ; __append(escapeFn( ticket.status === 'open' ? 'selected' : '' ))
    ; __append(">Open</option>\r\n                      <option value=\"in_progress\" ")
    ; __append(escapeFn( ticket.status === 'in_progress' ? 'selected' : '' ))
    ; __append(">In Progress</option>\r\n                      <option value=\"resolved\" ")
    ; __append(escapeFn( ticket.status === 'resolved' ? 'selected' : '' ))
    ; __append(">Resolved</option>\r\n                      <option value=\"closed\" ")
    ; __append(escapeFn( ticket.status === 'closed' ? 'selected' : '' ))
    ; __append(">Closed</option>\r\n                    </select>\r\n                    <input type=\"text\" name=\"resolutionNote\" class=\"ticket-inline-note\" maxlength=\"500\" placeholder=\"Resolution note (optional)\">\r\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\">Update</button>\r\n                  </form>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }); 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">No tickets match the current filters.</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "admin/users": function (locals, escapeFn, include, rethrow) {
var users = locals.users, filters = locals.filters, message = locals.message, availableCities = locals.availableCities, user = locals.user, auditLogMap = locals.auditLogMap;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>User Governance - SOVA Admin</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  ")
    ; 
    const staffUsers = users.filter((account) => ['employee', 'management', 'admin'].includes(account.role));
    const adminCount = users.filter((account) => account.role === 'admin').length;
    const managementCount = users.filter((account) => account.role === 'management').length;
    const employeeCount = users.filter((account) => account.role === 'employee').length;
    const customerCount = users.filter((account) => ['customer', 'user'].includes(account.role)).length;
    const activeFilterCount = [filters.q, filters.role !== 'all' ? filters.role : '', filters.city !== 'all' ? filters.city : ''].filter(Boolean).length;
  
    ; __append("\r\n\r\n  <main class=\"container governance-page\">\r\n    <div class=\"events-page-header\" style=\"margin-bottom:2rem;\">\r\n      <div>\r\n        <h1>User Governance</h1>\r\n        <p style=\"color:var(--muted);margin-top:0.25rem;\">Manage account roles, operational scope, and location coverage from a single control surface.</p>\r\n      </div>\r\n      <a href=\"/admin\" class=\"btn btn-secondary btn-sm\">← Back to Workspace</a>\r\n    </div>\r\n\r\n    ")
    ;  if (locals.message) { 
    ; __append("\r\n      <div class=\"alert alert-success\" style=\"margin-bottom:1.5rem;\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <section class=\"governance-summary-grid\">\r\n      <article class=\"governance-summary-card governance-summary-card-accent\">\r\n        <span class=\"governance-summary-label\">Total Accounts</span>\r\n        <strong>")
    ; __append(escapeFn( users.length ))
    ; __append("</strong>\r\n        <p>All active profiles currently available for policy and access review.</p>\r\n      </article>\r\n      <article class=\"governance-summary-card\">\r\n        <span class=\"governance-summary-label\">Admins</span>\r\n        <strong>")
    ; __append(escapeFn( adminCount ))
    ; __append("</strong>\r\n        <p>Users with workspace governance and platform control access.</p>\r\n      </article>\r\n      <article class=\"governance-summary-card\">\r\n        <span class=\"governance-summary-label\">Employees</span>\r\n        <strong>")
    ; __append(escapeFn( employeeCount ))
    ; __append("</strong>\r\n        <p>Concierge staff with operational access to property workflows.</p>\r\n      </article>\r\n      <article class=\"governance-summary-card\">\r\n        <span class=\"governance-summary-label\">Management</span>\r\n        <strong>")
    ; __append(escapeFn( managementCount ))
    ; __append("</strong>\r\n        <p>Operational managers with limited admin workspace permissions.</p>\r\n      </article>\r\n      <article class=\"governance-summary-card\">\r\n        <span class=\"governance-summary-label\">Public Accounts</span>\r\n        <strong>")
    ; __append(escapeFn( customerCount ))
    ; __append("</strong>\r\n        <p>Customer and basic user accounts without staff governance scope.</p>\r\n      </article>\r\n    </section>\r\n\r\n    <section class=\"governance-command-bar\">\r\n      <div>\r\n        <h2>Access Control Directory</h2>\r\n        <p>")
    ; __append(escapeFn( staffUsers.length ))
    ; __append(" staff account")
    ; __append(escapeFn( staffUsers.length === 1 ? '' : 's' ))
    ; __append(" currently hold operational access across ")
    ; __append(escapeFn( availableCities.length ))
    ; __append(" enabled location")
    ; __append(escapeFn( availableCities.length === 1 ? '' : 's' ))
    ; __append(".")
    ; __append(escapeFn( activeFilterCount ? ' ' + users.length + ' result' + (users.length === 1 ? '' : 's') + ' match the current filters.' : '' ))
    ; __append("</p>\r\n      </div>\r\n      <div class=\"governance-command-bar-notes\">\r\n        <span class=\"badge-status badge-admin\">Role Changes</span>\r\n        <span class=\"badge-status badge-city\">Location Scope</span>\r\n        <span class=\"badge-status badge-user\">Live Policy Editor</span>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"governance-filter-panel\">\r\n      <form method=\"GET\" action=\"/admin/users\" class=\"governance-filter-form\">\r\n        <label class=\"governance-filter-field governance-filter-field-search\">\r\n          <span>Search Accounts</span>\r\n          <input type=\"search\" name=\"q\" value=\"")
    ; __append(escapeFn( filters.q ))
    ; __append("\" class=\"form-control\" placeholder=\"Search by username or email\">\r\n        </label>\r\n\r\n        <label class=\"governance-filter-field\">\r\n          <span>Role</span>\r\n          <select name=\"role\" class=\"form-control governance-select\">\r\n            <option value=\"all\" ")
    ; __append(escapeFn( filters.role === 'all' ? 'selected' : '' ))
    ; __append(">All roles</option>\r\n            <option value=\"admin\" ")
    ; __append(escapeFn( filters.role === 'admin' ? 'selected' : '' ))
    ; __append(">Admin</option>\r\n            <option value=\"management\" ")
    ; __append(escapeFn( filters.role === 'management' ? 'selected' : '' ))
    ; __append(">Management</option>\r\n            <option value=\"employee\" ")
    ; __append(escapeFn( filters.role === 'employee' ? 'selected' : '' ))
    ; __append(">Employee</option>\r\n            <option value=\"user\" ")
    ; __append(escapeFn( filters.role === 'user' ? 'selected' : '' ))
    ; __append(">User</option>\r\n          </select>\r\n        </label>\r\n\r\n        <label class=\"governance-filter-field\">\r\n          <span>Location</span>\r\n          <select name=\"city\" class=\"form-control governance-select\">\r\n            <option value=\"all\" ")
    ; __append(escapeFn( filters.city === 'all' ? 'selected' : '' ))
    ; __append(">All enabled cities</option>\r\n            ")
    ;  availableCities.forEach((cityOption) => { 
    ; __append("\r\n              <option value=\"")
    ; __append(escapeFn( cityOption ))
    ; __append("\" ")
    ; __append(escapeFn( filters.city === cityOption ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( cityOption ))
    ; __append("</option>\r\n            ")
    ;  }) 
    ; __append("\r\n          </select>\r\n        </label>\r\n\r\n        <div class=\"governance-filter-actions\">\r\n          <button type=\"submit\" class=\"btn btn-secondary\">Apply Filters</button>\r\n          <a href=\"/admin/users\" class=\"btn btn-link\">Clear</a>\r\n        </div>\r\n      </form>\r\n    </section>\r\n\r\n    <section class=\"governance-user-grid\">\r\n      ")
    ;  if (!users.length) { 
    ; __append("\r\n        <article class=\"governance-empty-state\">\r\n          <h3>No accounts match the current filters</h3>\r\n          <p>Adjust the search, role, or location filters to expand the governance directory.</p>\r\n          <a href=\"/admin/users\" class=\"btn btn-secondary\">Reset Filters</a>\r\n        </article>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  users.forEach((account) => { 
    ; __append("\r\n        ")
    ;  const isStaff = account.role === 'employee' || account.role === 'management' || account.role === 'admin'; 
    ; __append("\r\n        ")
    ;  const isSelf = account.id === user.id; 
    ; __append("\r\n        ")
    ;  const allowedCities = (account.allowed_cities || '').split(',').map((city) => city.trim()).filter(Boolean); 
    ; __append("\r\n        ")
    ;  const locationSelection = allowedCities.length ? allowedCities : [account.primary_city || 'DALLAS']; 
    ; __append("\r\n        ")
    ;  const auditEntries = auditLogMap[account.id] || []; 
    ; __append("\r\n\r\n        <article class=\"governance-user-card ")
    ; __append(escapeFn( isSelf ? 'governance-user-card-self' : '' ))
    ; __append("\">\r\n          <div class=\"governance-user-card-head\">\r\n            <div>\r\n              <div class=\"governance-user-title-row\">\r\n                <h3>")
    ; __append(escapeFn( account.username ))
    ; __append("</h3>\r\n                <span class=\"badge-status badge-")
    ; __append(escapeFn( account.role ))
    ; __append("\">")
    ; __append(escapeFn( account.role ))
    ; __append("</span>\r\n                ")
    ;  if (isSelf) { 
    ; __append("\r\n                  <span class=\"badge-status badge-city-soft\">Your Account</span>\r\n                ")
    ;  } 
    ; __append("\r\n              </div>\r\n              <p class=\"governance-user-email\">")
    ; __append(escapeFn( account.email ))
    ; __append("</p>\r\n            </div>\r\n            <div class=\"governance-user-meta\">\r\n              <span>ID ")
    ; __append(escapeFn( account.id ))
    ; __append("</span>\r\n              <span>Joined ")
    ; __append(escapeFn( new Date(account.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ))
    ; __append("</span>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"governance-user-layout\">\r\n            <section class=\"governance-user-panel\">\r\n              <h4>Access Snapshot</h4>\r\n              <div class=\"governance-info-list\">\r\n                <div class=\"governance-info-item\">\r\n                  <span class=\"governance-info-label\">Current Role</span>\r\n                  <strong>")
    ; __append(escapeFn( account.role ))
    ; __append("</strong>\r\n                </div>\r\n                <div class=\"governance-info-item\">\r\n                  <span class=\"governance-info-label\">Department / Title</span>\r\n                  <strong>")
    ; __append(escapeFn( account.department ? account.department + (account.job_title ? ' — ' + account.job_title : '') : 'Not assigned' ))
    ; __append("</strong>\r\n                </div>\r\n                <div class=\"governance-info-item\">\r\n                  <span class=\"governance-info-label\">Primary Location</span>\r\n                  <strong>")
    ; __append(escapeFn( isStaff ? (account.primary_city || 'DALLAS') : 'Not in staff scope' ))
    ; __append("</strong>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"governance-badge-stack\">\r\n                ")
    ;  if (isStaff) { 
    ; __append("\r\n                  <span class=\"badge-status badge-city\">Primary: ")
    ; __append(escapeFn( account.primary_city || 'DALLAS' ))
    ; __append("</span>\r\n                  ")
    ;  locationSelection.forEach((cityOption) => { 
    ; __append("\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( cityOption ))
    ; __append("</span>\r\n                  ")
    ;  }) 
    ; __append("\r\n                ")
    ;  } else { 
    ; __append("\r\n                  <span class=\"badge-status badge-user\">Public Account</span>\r\n                ")
    ;  } 
    ; __append("\r\n              </div>\r\n\r\n              <p class=\"governance-panel-note\">\r\n                ")
    ;  if (isStaff) { 
    ; __append("\r\n                  This account is already provisioned for internal workspace access.\r\n                ")
    ;  } else { 
    ; __append("\r\n                  Promote this account to employee or admin if it should be moved into staff operations.\r\n                ")
    ;  } 
    ; __append("\r\n              </p>\r\n            </section>\r\n\r\n            <section class=\"governance-user-panel governance-user-panel-form\">\r\n              <h4>Manage Access</h4>\r\n              <form method=\"POST\" action=\"/admin/users/")
    ; __append(escapeFn( account.id ))
    ; __append("/access\" class=\"governance-form\" data-governance-form>\r\n                <input type=\"hidden\" name=\"filter_q\" value=\"")
    ; __append(escapeFn( filters.q ))
    ; __append("\">\r\n                <input type=\"hidden\" name=\"filter_role\" value=\"")
    ; __append(escapeFn( filters.role ))
    ; __append("\">\r\n                <input type=\"hidden\" name=\"filter_city\" value=\"")
    ; __append(escapeFn( filters.city ))
    ; __append("\">\r\n\r\n                <label class=\"governance-field\">\r\n                  <span>Username</span>\r\n                  <input type=\"text\" name=\"username\" class=\"form-control\" value=\"")
    ; __append(escapeFn( account.username ))
    ; __append("\" required>\r\n                </label>\r\n\r\n                <div class=\"governance-form-row\">\r\n                  <label class=\"governance-field\">\r\n                    <span>Role</span>\r\n                    ")
    ;  if (isSelf) { 
    ; __append("\r\n                      <input type=\"hidden\" name=\"role\" value=\"")
    ; __append(escapeFn( account.role ))
    ; __append("\">\r\n                      <select class=\"form-control governance-select\" disabled>\r\n                        <option>")
    ; __append(escapeFn( account.role ))
    ; __append("</option>\r\n                      </select>\r\n                    ")
    ;  } else { 
    ; __append("\r\n                      <select name=\"role\" class=\"form-control governance-select\" data-governance-role-select>\r\n                        <option value=\"user\" ")
    ; __append(escapeFn( account.role === 'user' ? 'selected' : '' ))
    ; __append(">user</option>\r\n                        <option value=\"employee\" ")
    ; __append(escapeFn( account.role === 'employee' ? 'selected' : '' ))
    ; __append(">employee</option>\r\n                        <option value=\"management\" ")
    ; __append(escapeFn( account.role === 'management' ? 'selected' : '' ))
    ; __append(">management</option>\r\n                        <option value=\"admin\" ")
    ; __append(escapeFn( account.role === 'admin' ? 'selected' : '' ))
    ; __append(">admin</option>\r\n                      </select>\r\n                    ")
    ;  } 
    ; __append("\r\n                  </label>\r\n\r\n                  <label class=\"governance-field\">\r\n                    <span>Primary City</span>\r\n                    <select name=\"primaryCity\" class=\"form-control governance-select\">\r\n                      ")
    ;  availableCities.forEach((cityOption) => { 
    ; __append("\r\n                        <option value=\"")
    ; __append(escapeFn( cityOption ))
    ; __append("\" ")
    ; __append(escapeFn( (account.primary_city || 'DALLAS') === cityOption ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( cityOption ))
    ; __append("</option>\r\n                      ")
    ;  }) 
    ; __append("\r\n                    </select>\r\n                  </label>\r\n                </div>\r\n\r\n                <div class=\"governance-field\">\r\n                  <span>Allowed City Access</span>\r\n                  <div class=\"governance-city-options\">\r\n                    ")
    ;  availableCities.forEach((cityOption) => { 
    ; __append("\r\n                      <label class=\"governance-city-check\">\r\n                        <input type=\"checkbox\" name=\"allowedCities\" value=\"")
    ; __append(escapeFn( cityOption ))
    ; __append("\" ")
    ; __append(escapeFn( locationSelection.includes(cityOption) ? 'checked' : '' ))
    ; __append(">\r\n                        <span>")
    ; __append(escapeFn( cityOption ))
    ; __append("</span>\r\n                      </label>\r\n                    ")
    ;  }) 
    ; __append("\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"governance-form-row\">\r\n                  <label class=\"governance-field\">\r\n                    <span>Set New Password (optional)</span>\r\n                    <input type=\"password\" name=\"newPassword\" class=\"form-control\" minlength=\"8\" placeholder=\"Leave blank to keep current password\">\r\n                  </label>\r\n\r\n                  <label class=\"governance-field\">\r\n                    <span>Confirm New Password</span>\r\n                    <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" minlength=\"8\" placeholder=\"Repeat new password\">\r\n                  </label>\r\n                </div>\r\n\r\n                <div class=\"governance-risk-banner ")
    ; __append(escapeFn( account.role === 'admin' ? 'governance-risk-banner-visible' : '' ))
    ; __append("\" data-governance-risk-banner>\r\n                  <strong>High-risk permission change</strong>\r\n                  <p>Admin access grants governance controls, invite management, audit visibility, and platform-level configuration changes. Only assign this role when operationally necessary.</p>\r\n                </div>\r\n\r\n                <div class=\"governance-form-actions\">\r\n                  <div class=\"governance-form-guidance\">\r\n                    ")
    ;  if (isSelf) { 
    ; __append("\r\n                      <span class=\"muted-text\">Your role is locked here, but location settings can still be updated.</span>\r\n                    ")
    ;  } else { 
    ; __append("\r\n                      <span class=\"muted-text\">Changes apply immediately after saving.</span>\r\n                    ")
    ;  } 
    ; __append("\r\n                  </div>\r\n                  <button type=\"submit\" class=\"btn btn-secondary\">Save Access</button>\r\n                </div>\r\n              </form>\r\n\r\n              ")
    ;  if (!isSelf) { 
    ; __append("\r\n                <div class=\"governance-danger-zone\">\r\n                  <div>\r\n                    <strong>Delete Account</strong>\r\n                    <p>This removes the account from active access, signs the user out of future logins, and archives the account through the existing soft-delete flow.</p>\r\n                  </div>\r\n\r\n                  <form method=\"POST\" action=\"/admin/users/")
    ; __append(escapeFn( account.id ))
    ; __append("/delete\" class=\"governance-danger-form\">\r\n                    <input type=\"hidden\" name=\"filter_q\" value=\"")
    ; __append(escapeFn( filters.q ))
    ; __append("\">\r\n                    <input type=\"hidden\" name=\"filter_role\" value=\"")
    ; __append(escapeFn( filters.role ))
    ; __append("\">\r\n                    <input type=\"hidden\" name=\"filter_city\" value=\"")
    ; __append(escapeFn( filters.city ))
    ; __append("\">\r\n                    <label class=\"governance-field\">\r\n                      <span>Type DELETE to confirm</span>\r\n                      <input type=\"text\" name=\"confirmationText\" class=\"form-control\" placeholder=\"DELETE\" required>\r\n                    </label>\r\n                    <button type=\"submit\" class=\"btn btn-danger\">Delete Account</button>\r\n                  </form>\r\n                </div>\r\n              ")
    ;  } 
    ; __append("\r\n\r\n              ")
    ;  if (auditEntries.length) { 
    ; __append("\r\n                <details class=\"governance-audit-history\">\r\n                  <summary>\r\n                    <span>Access Change History</span>\r\n                    <span class=\"governance-audit-summary\">")
    ; __append(escapeFn( auditEntries.length + ' recent entr' + (auditEntries.length === 1 ? 'y' : 'ies') ))
    ; __append("</span>\r\n                  </summary>\r\n\r\n                  <div class=\"governance-audit-list\">\r\n                    ")
    ;  auditEntries.forEach((entry) => { 
    ; __append("\r\n                      <article class=\"governance-audit-item\">\r\n                        <div class=\"governance-audit-item-head\">\r\n                          <strong>")
    ; __append(escapeFn( entry.change_summary ))
    ; __append("</strong>\r\n                          <span>")
    ; __append(escapeFn( new Date(entry.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) ))
    ; __append("</span>\r\n                        </div>\r\n                        <p>Updated by <strong>")
    ; __append(escapeFn( entry.actor_username || 'Unknown admin' ))
    ; __append("</strong></p>\r\n                        <div class=\"governance-audit-badges\">\r\n                          <span class=\"badge-status badge-")
    ; __append(escapeFn( entry.new_role || 'user' ))
    ; __append("\">")
    ; __append(escapeFn( entry.old_role || 'none' ))
    ; __append(" → ")
    ; __append(escapeFn( entry.new_role || 'none' ))
    ; __append("</span>\r\n                          ")
    ;  if (entry.new_primary_city || entry.old_primary_city) { 
    ; __append("\r\n                            <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( entry.old_primary_city || 'none' ))
    ; __append(" → ")
    ; __append(escapeFn( entry.new_primary_city || 'none' ))
    ; __append("</span>\r\n                          ")
    ;  } 
    ; __append("\r\n                        </div>\r\n                      </article>\r\n                    ")
    ;  }) 
    ; __append("\r\n                  </div>\r\n                </details>\r\n              ")
    ;  } else { 
    ; __append("\r\n                <div class=\"governance-audit-empty\">\r\n                  <strong>Access Change History</strong>\r\n                  <p class=\"muted-text\">This account has not had any recorded governance changes yet.</p>\r\n                </div>\r\n              ")
    ;  } 
    ; __append("\r\n            </section>\r\n          </div>\r\n        </article>\r\n      ")
    ;  }) 
    ; __append("\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n\r\n  <script>\r\n    (() => {\r\n      const forms = Array.from(document.querySelectorAll('[data-governance-form]'));\r\n\r\n      forms.forEach((form) => {\r\n        const roleSelect = form.querySelector('[data-governance-role-select]');\r\n        const riskBanner = form.querySelector('[data-governance-risk-banner]');\r\n\r\n        if (!roleSelect || !riskBanner) {\r\n          return;\r\n        }\r\n\r\n        const syncRiskBanner = () => {\r\n          riskBanner.classList.toggle('governance-risk-banner-visible', roleSelect.value === 'admin');\r\n        };\r\n\r\n        roleSelect.addEventListener('change', syncRiskBanner);\r\n        syncRiskBanner();\r\n      });\r\n    })();\r\n  </script>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "auth/location-select": function (locals, escapeFn, include, rethrow) {
var identifier = locals.identifier, message = locals.message, cities = locals.cities, selectedCity = locals.selectedCity;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Select Location - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Select Your Location</h1>\r\n      <p class=\"auth-subtext\">Choose which property interface to open for <strong>")
    ; __append(escapeFn( identifier ))
    ; __append("</strong>.</p>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/location\">\r\n        <div class=\"form-group\">\r\n          <label for=\"city\">Location</label>\r\n          <select id=\"city\" name=\"city\" required>\r\n            ")
    ;  cities.forEach(city => { 
    ; __append("\r\n              <option value=\"")
    ; __append(escapeFn( city ))
    ; __append("\" ")
    ; __append(escapeFn( selectedCity === city ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( city ))
    ; __append("</option>\r\n            ")
    ;  }) 
    ; __append("\r\n          </select>\r\n        </div>\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Continue</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>")
  return __output;

},
  "auth/login": function (locals, escapeFn, include, rethrow) {
var recaptchaSiteKey = locals.recaptchaSiteKey, recaptchaMode = locals.recaptchaMode, message = locals.message, identifier = locals.identifier;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Login - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n  ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n    ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js?render=")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></script>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\r\n    ")
    ;  } 
    ; __append("\r\n  ")
    ;  } 
    ; __append("\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Login</h1>\r\n      \r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/login\" class=\"js-recaptcha-v3-form\" data-recaptcha-action=\"login\">\r\n        <div class=\"form-group\">\r\n          <label for=\"email\">Email or Username</label>\r\n          <input type=\"text\" id=\"email\" name=\"email\" value=\"")
    ; __append(escapeFn( identifier || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"password\">Password</label>\r\n          <input type=\"password\" id=\"password\" name=\"password\" required>\r\n        </div>\r\n\r\n        ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n          ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n            <input type=\"hidden\" name=\"g-recaptcha-response\" class=\"js-recaptcha-token\" value=\"\">\r\n            <div class=\"alert alert-error js-recaptcha-error\" style=\"display:none; margin-top:0.75rem;\"></div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"form-group\">\r\n              <div class=\"g-recaptcha\" data-sitekey=\"")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></div>\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Login</button>\r\n      </form>\r\n\r\n      <div class=\"auth-link auth-link-secondary\">\r\n        <a href=\"/support/contact\">Forgot username?</a>\r\n        <span>•</span>\r\n        <a href=\"/support/contact\">Forgot password?</a>\r\n      </div>\r\n\r\n      <div class=\"auth-link\" style=\"margin-top: 0.75rem; color:#888; font-size:0.85rem;\">\r\n        Registration is disabled in the demo.\r\n      </div>\r\n\r\n      <div class=\"demo-credentials\">\r\n        <p><strong>Demo accounts:</strong></p>\r\n        <p>Email: <strong>guest@sova.com</strong> | Password: <strong>Guest1234</strong> | <em>Guest</em></p>\r\n        <p>Email: <strong>employee@sova.com</strong> | Password: <strong>Employee1234</strong> | <em>Employee</em></p>\r\n        <p>Email: <strong>management@sova.com</strong> | Password: <strong>Management1234</strong> | <em>Management</em></p>\r\n        <p>Email: <strong>admin@sova.com</strong> | Password: <strong>Admin1234</strong> | <em>Admin</em></p>\r\n        <p style=\"margin-top:0.5rem;color:#888;font-size:0.8rem;\">Changes are isolated to your demo session and cleared when you log out.</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  ")
    ; __append( include('../partials/coming-soon-modal') )
    ; __append("\r\n\r\n  ")
    ;  if (recaptchaSiteKey && recaptchaMode === 'v3') { 
    ; __append("\r\n  <script>\r\n    (() => {\r\n      const forms = Array.from(document.querySelectorAll('.js-recaptcha-v3-form'));\r\n      console.log('reCAPTCHA Debug - Forms found:', forms.length);\r\n      console.log('reCAPTCHA Debug - grecaptcha available:', typeof grecaptcha !== 'undefined');\r\n      \r\n      if (!forms.length || typeof grecaptcha === 'undefined') {\r\n        console.warn('reCAPTCHA Debug - Skipping: forms=' + forms.length + ', grecaptcha=' + typeof grecaptcha);\r\n        return;\r\n      }\r\n\r\n      forms.forEach((form) => {\r\n        form.addEventListener('submit', (event) => {\r\n          const tokenField = form.querySelector('.js-recaptcha-token');\r\n          const errorBox = form.querySelector('.js-recaptcha-error');\r\n\r\n          const showRecaptchaError = (message) => {\r\n            console.error('reCAPTCHA Error:', message);\r\n            if (!errorBox) {\r\n              return;\r\n            }\r\n\r\n            errorBox.textContent = message;\r\n            errorBox.style.display = 'block';\r\n          };\r\n\r\n          if (errorBox) {\r\n            errorBox.style.display = 'none';\r\n            errorBox.textContent = '';\r\n          }\r\n\r\n          if (!tokenField) {\r\n            console.warn('reCAPTCHA Debug - No token field found');\r\n            return;\r\n          }\r\n\r\n          if (tokenField.value) {\r\n            console.log('reCAPTCHA Debug - Token already present, allowing submission');\r\n            return;\r\n          }\r\n\r\n          if (typeof grecaptcha === 'undefined') {\r\n            event.preventDefault();\r\n            showRecaptchaError('reCAPTCHA is not available right now. Disable ad blockers for this site and refresh the page.');\r\n            return;\r\n          }\r\n\r\n          console.log('reCAPTCHA Debug - Starting token generation');\r\n          event.preventDefault();\r\n          const action = form.getAttribute('data-recaptcha-action') || 'submit';\r\n\r\n          grecaptcha.ready(() => {\r\n            console.log('reCAPTCHA Debug - grecaptcha.ready called, executing with action:', action);\r\n            grecaptcha.execute('")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("', { action }).then((token) => {\r\n              console.log('reCAPTCHA Debug - Token generated successfully:', token ? 'yes' : 'no');\r\n              tokenField.value = token || '';\r\n              form.submit();\r\n            }).catch((err) => {\r\n              console.error('reCAPTCHA Debug - Token generation failed:', err);\r\n              showRecaptchaError('reCAPTCHA is not available for this domain yet. Verify allowed domains in Google reCAPTCHA settings and try again.');\r\n            });\r\n          });\r\n        });\r\n      });\r\n    })();\r\n  </script>\r\n  ")
    ;  } 
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "auth/register-customer": function (locals, escapeFn, include, rethrow) {
var recaptchaSiteKey = locals.recaptchaSiteKey, recaptchaMode = locals.recaptchaMode, message = locals.message, formData = locals.formData;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Create Guest Account - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n  ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n    ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js?render=")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></script>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\r\n    ")
    ;  } 
    ; __append("\r\n  ")
    ;  } 
    ; __append("\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Create Guest Account</h1>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/register-customer\" class=\"js-recaptcha-v3-form\" data-recaptcha-action=\"register_customer\">\r\n        <div class=\"form-group\">\r\n          <label for=\"username\">Username</label>\r\n          <input type=\"text\" id=\"username\" name=\"username\" value=\"")
    ; __append(escapeFn( formData?.username || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"email\">Email</label>\r\n          <input type=\"email\" id=\"email\" name=\"email\" value=\"")
    ; __append(escapeFn( formData?.email || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"password\">Password</label>\r\n          <input type=\"password\" id=\"password\" name=\"password\" minlength=\"8\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"passwordConfirm\">Confirm Password</label>\r\n          <input type=\"password\" id=\"passwordConfirm\" name=\"passwordConfirm\" minlength=\"8\" required>\r\n        </div>\r\n\r\n        ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n          ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n            <input type=\"hidden\" name=\"g-recaptcha-response\" class=\"js-recaptcha-token\" value=\"\">\r\n            <div class=\"alert alert-error js-recaptcha-error\" style=\"display:none; margin-top:0.75rem;\"></div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"form-group\">\r\n              <div class=\"g-recaptcha\" data-sitekey=\"")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></div>\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Create Guest Account</button>\r\n      </form>\r\n\r\n      <p class=\"auth-link\">Already have an account? <a href=\"/auth/login\">Login here</a></p>\r\n    </div>\r\n  </div>\r\n\r\n  ")
    ;  if (recaptchaSiteKey && recaptchaMode === 'v3') { 
    ; __append("\r\n  <script>\r\n    (() => {\r\n      const forms = Array.from(document.querySelectorAll('.js-recaptcha-v3-form'));\r\n      if (!forms.length || typeof grecaptcha === 'undefined') {\r\n        return;\r\n      }\r\n\r\n      forms.forEach((form) => {\r\n        form.addEventListener('submit', (event) => {\r\n          const tokenField = form.querySelector('.js-recaptcha-token');\r\n          const errorBox = form.querySelector('.js-recaptcha-error');\r\n\r\n          const showRecaptchaError = (message) => {\r\n            if (!errorBox) {\r\n              return;\r\n            }\r\n\r\n            errorBox.textContent = message;\r\n            errorBox.style.display = 'block';\r\n          };\r\n\r\n          if (errorBox) {\r\n            errorBox.style.display = 'none';\r\n            errorBox.textContent = '';\r\n          }\r\n\r\n          if (!tokenField || tokenField.value) {\r\n            return;\r\n          }\r\n\r\n          if (typeof grecaptcha === 'undefined') {\r\n            event.preventDefault();\r\n            showRecaptchaError('reCAPTCHA is not available right now. Disable ad blockers for this site and refresh the page.');\r\n            return;\r\n          }\r\n\r\n          event.preventDefault();\r\n          const action = form.getAttribute('data-recaptcha-action') || 'submit';\r\n\r\n          grecaptcha.ready(() => {\r\n            grecaptcha.execute('")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("', { action }).then((token) => {\r\n              tokenField.value = token || '';\r\n              form.submit();\r\n            }).catch(() => {\r\n              showRecaptchaError('reCAPTCHA is not available for this domain yet. Verify allowed domains in Google reCAPTCHA settings and try again.');\r\n            });\r\n          });\r\n        });\r\n      });\r\n    })();\r\n  </script>\r\n  ")
    ;  } 
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "auth/register-employee": function (locals, escapeFn, include, rethrow) {
var recaptchaSiteKey = locals.recaptchaSiteKey, recaptchaMode = locals.recaptchaMode, message = locals.message, formData = locals.formData;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Create Employee Account - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n  ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n    ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js?render=")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></script>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\r\n    ")
    ;  } 
    ; __append("\r\n  ")
    ;  } 
    ; __append("\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Create Employee Account</h1>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/register-employee\" class=\"js-recaptcha-v3-form\" data-recaptcha-action=\"register_employee\">\r\n        <div class=\"form-group\">\r\n          <label for=\"firstName\">First Name</label>\r\n          <input type=\"text\" id=\"firstName\" name=\"firstName\" value=\"")
    ; __append(escapeFn( formData?.firstName || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"lastName\">Last Name</label>\r\n          <input type=\"text\" id=\"lastName\" name=\"lastName\" value=\"")
    ; __append(escapeFn( formData?.lastName || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"email\">Email</label>\r\n          <input type=\"email\" id=\"email\" name=\"email\" value=\"")
    ; __append(escapeFn( formData?.email || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"password\">Password</label>\r\n          <input type=\"password\" id=\"password\" name=\"password\" minlength=\"8\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"passwordConfirm\">Confirm Password</label>\r\n          <input type=\"password\" id=\"passwordConfirm\" name=\"passwordConfirm\" minlength=\"8\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"inviteCode\">Employee Invite Code</label>\r\n          <input type=\"text\" id=\"inviteCode\" name=\"inviteCode\" value=\"")
    ; __append(escapeFn( formData?.inviteCode || '' ))
    ; __append("\" placeholder=\"Required unless an admin is creating the account\">\r\n        </div>\r\n\r\n        ")
    ;  if (recaptchaSiteKey) { 
    ; __append("\r\n          ")
    ;  if (recaptchaMode === 'v3') { 
    ; __append("\r\n            <input type=\"hidden\" name=\"g-recaptcha-response\" class=\"js-recaptcha-token\" value=\"\">\r\n            <div class=\"alert alert-error js-recaptcha-error\" style=\"display:none; margin-top:0.75rem;\"></div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"form-group\">\r\n              <div class=\"g-recaptcha\" data-sitekey=\"")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("\"></div>\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Create Employee Account</button>\r\n      </form>\r\n\r\n      <p class=\"auth-link\">Already have an account? <a href=\"/auth/login\">Login here</a></p>\r\n    </div>\r\n  </div>\r\n\r\n  ")
    ;  if (recaptchaSiteKey && recaptchaMode === 'v3') { 
    ; __append("\r\n  <script>\r\n    (() => {\r\n      const forms = Array.from(document.querySelectorAll('.js-recaptcha-v3-form'));\r\n      if (!forms.length || typeof grecaptcha === 'undefined') {\r\n        return;\r\n      }\r\n\r\n      forms.forEach((form) => {\r\n        form.addEventListener('submit', (event) => {\r\n          const tokenField = form.querySelector('.js-recaptcha-token');\r\n          const errorBox = form.querySelector('.js-recaptcha-error');\r\n\r\n          const showRecaptchaError = (message) => {\r\n            if (!errorBox) {\r\n              return;\r\n            }\r\n\r\n            errorBox.textContent = message;\r\n            errorBox.style.display = 'block';\r\n          };\r\n\r\n          if (errorBox) {\r\n            errorBox.style.display = 'none';\r\n            errorBox.textContent = '';\r\n          }\r\n\r\n          if (!tokenField || tokenField.value) {\r\n            return;\r\n          }\r\n\r\n          if (typeof grecaptcha === 'undefined') {\r\n            event.preventDefault();\r\n            showRecaptchaError('reCAPTCHA is not available right now. Disable ad blockers for this site and refresh the page.');\r\n            return;\r\n          }\r\n\r\n          event.preventDefault();\r\n          const action = form.getAttribute('data-recaptcha-action') || 'submit';\r\n\r\n          grecaptcha.ready(() => {\r\n            grecaptcha.execute('")
    ; __append(escapeFn( recaptchaSiteKey ))
    ; __append("', { action }).then((token) => {\r\n              tokenField.value = token || '';\r\n              form.submit();\r\n            }).catch(() => {\r\n              showRecaptchaError('reCAPTCHA is not available for this domain yet. Verify allowed domains in Google reCAPTCHA settings and try again.');\r\n            });\r\n          });\r\n        });\r\n      });\r\n    })();\r\n  </script>\r\n  ")
    ;  } 
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "auth/register": function (locals, escapeFn, include, rethrow) {
var message = locals.message;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Register - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Create Account</h1>\r\n      \r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/register\">\r\n        <div class=\"form-group\">\r\n          <label for=\"username\">Username</label>\r\n          <input type=\"text\" id=\"username\" name=\"username\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"email\">Email</label>\r\n          <input type=\"email\" id=\"email\" name=\"email\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"password\">Password</label>\r\n          <input type=\"password\" id=\"password\" name=\"password\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"passwordConfirm\">Confirm Password</label>\r\n          <input type=\"password\" id=\"passwordConfirm\" name=\"passwordConfirm\" required>\r\n        </div>\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Register</button>\r\n      </form>\r\n\r\n      <p class=\"auth-link\">Already have an account? <a href=\"/auth/login\">Login here</a></p>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "auth/two-factor": function (locals, escapeFn, include, rethrow) {
var identifier = locals.identifier, message = locals.message, code = locals.code;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Two-Factor Verification - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  <div class=\"auth-container\">\r\n    <div class=\"auth-box\">\r\n      <h1>Two-Factor Verification</h1>\r\n      <p class=\"auth-subtext\">Enter the 6-digit code from your authenticator app to finish signing in to <strong>")
    ; __append(escapeFn( identifier ))
    ; __append("</strong>.</p>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/auth/2fa\">\r\n        <div class=\"form-group\">\r\n          <label for=\"code\">Authentication Code</label>\r\n          <input type=\"text\" id=\"code\" name=\"code\" value=\"")
    ; __append(escapeFn( code || '' ))
    ; __append("\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" maxlength=\"6\" required>\r\n        </div>\r\n\r\n        <button type=\"submit\" class=\"btn btn-primary btn-block\">Verify And Continue</button>\r\n      </form>\r\n\r\n      <p class=\"auth-link\"><a href=\"/auth/login\">Back to login</a></p>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>")
  return __output;

},
  "contact": function (locals, escapeFn, include, rethrow) {
var message = locals.message, messageType = locals.messageType, platformConfig = locals.platformConfig, city = locals.city, formData = locals.formData;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Contact Support - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('./partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"content-page support-page\">\r\n      <div class=\"support-hero\">\r\n        <div>\r\n          <p class=\"support-eyebrow\">Support Center</p>\r\n          <h1>Contact Support</h1>\r\n          <p>Send a direct message to the platform team with the issue details.</p>\r\n        </div>\r\n        <div class=\"support-quick-links\">\r\n          <a class=\"support-chip\" href=\"/support\">Support Home</a>\r\n          <a class=\"support-chip\" href=\"/support/faq\">FAQ</a>\r\n          <a class=\"support-chip\" href=\"/support/suggestions\">Suggestion Box</a>\r\n        </div>\r\n      </div>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-")
    ; __append(escapeFn( messageType === 'success' ? 'success' : (messageType === 'error' ? 'error' : 'info') ))
    ; __append("\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <section class=\"support-section support-grid\">\r\n        <div class=\"support-card support-contact-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>Contact Support</h2>\r\n            <p>Tell us what happened and where it happened.</p>\r\n          </div>\r\n          <div class=\"support-contact-meta\">\r\n            <div>\r\n              <strong>Support Email</strong>\r\n              <p><a href=\"mailto:")
    ; __append(escapeFn( platformConfig.support_email ))
    ; __append("\">")
    ; __append(escapeFn( platformConfig.support_email ))
    ; __append("</a></p>\r\n            </div>\r\n            <div>\r\n              <strong>Active Location</strong>\r\n              <p>")
    ; __append(escapeFn( city ))
    ; __append("</p>\r\n            </div>\r\n          </div>\r\n          <form method=\"POST\" action=\"/support/contact\" class=\"support-form\">\r\n            <div class=\"form-group\">\r\n              <label for=\"contact_name\">Name</label>\r\n              <input type=\"text\" id=\"contact_name\" name=\"contact_name\" value=\"")
    ; __append(escapeFn( formData.contact_name || '' ))
    ; __append("\" required>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"contact_email\">Email</label>\r\n              <input type=\"email\" id=\"contact_email\" name=\"contact_email\" value=\"")
    ; __append(escapeFn( formData.contact_email || '' ))
    ; __append("\" required>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"contact_subject\">Subject</label>\r\n              <input type=\"text\" id=\"contact_subject\" name=\"contact_subject\" value=\"")
    ; __append(escapeFn( formData.contact_subject || '' ))
    ; __append("\" required>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"contact_message\">Message</label>\r\n              <textarea id=\"contact_message\" name=\"contact_message\" rows=\"6\" required>")
    ; __append(escapeFn( formData.contact_message || '' ))
    ; __append("</textarea>\r\n            </div>\r\n            <button type=\"submit\" class=\"btn btn-primary\">Send Message</button>\r\n          </form>\r\n        </div>\r\n\r\n        <div class=\"support-card support-aside-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>Contact Notes</h2>\r\n            <p>Include enough detail so support can reproduce the issue quickly.</p>\r\n          </div>\r\n          <ul class=\"support-list\">\r\n            <li>Reference the exact page, workflow, or content item.</li>\r\n            <li>Mention whether the issue happened in Dallas or Austin.</li>\r\n            <li>Include the account role involved: guest, employee, or admin.</li>\r\n            <li>Describe what you expected and what actually happened.</li>\r\n          </ul>\r\n        </div>\r\n      </section>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('./partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "demo-feature": function (locals, escapeFn, include, rethrow) {
var feature = locals.feature, message = locals.message;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( feature.title ))
    ; __append(" - SOVA Scoop Demo</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n  <style>\r\n    .demo-feature-page { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }\r\n    .demo-feature-head, .demo-feature-card, .demo-feature-form { background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; }\r\n    .demo-feature-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }\r\n    .demo-feature-head h1 { margin: 0 0 .35rem; }\r\n    .demo-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }\r\n    .demo-feature-form { display: grid; gap: .85rem; }\r\n    .demo-feature-form label { display: grid; gap: .35rem; font-weight: 600; }\r\n    .demo-feature-form input, .demo-feature-form select, .demo-feature-form textarea { width: 100%; padding: .7rem; border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; }\r\n    .demo-feature-actions { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: 1rem; }\r\n    .demo-feature-meta { color: #64748b; font-size: .9rem; }\r\n    .demo-feature-note { color: #475569; font-size: .9rem; }\r\n    .demo-feature-status { display: inline-block; padding: .2rem .55rem; background: #eef2ff; color: #3730a3; border-radius: 99px; font-size: .8rem; }\r\n  </style>\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('partials/navbar') )
    ; __append("\r\n  <main class=\"demo-feature-page\">\r\n    <header class=\"demo-feature-head\">\r\n      <div>\r\n        <h1>")
    ; __append(escapeFn( feature.title ))
    ; __append("</h1>\r\n        <p>")
    ; __append(escapeFn( feature.description ))
    ; __append("</p>\r\n      </div>\r\n      ")
    ;  if (feature.settingsHref) { 
    ; __append("\r\n        <a class=\"btn btn-primary\" href=\"")
    ; __append(escapeFn( feature.settingsHref ))
    ; __append("\">Account Settings</a>\r\n      ")
    ;  } 
    ; __append("\r\n      <a class=\"btn btn-secondary\" href=\"/\">SOVA Demo Home</a>\r\n    </header>\r\n\r\n    ")
    ;  if (message) { 
    ; __append("<p class=\"alert alert-info\" role=\"status\">")
    ; __append(escapeFn( message ))
    ; __append("</p>")
    ;  } 
    ; __append("\r\n    ")
    ;  if (feature.mode === 'profile') { 
    ; __append("\r\n      <form class=\"demo-feature-form\" method=\"POST\">\r\n        <input type=\"hidden\" name=\"action\" value=\"")
    ; __append(escapeFn( feature.formAction ))
    ; __append("\">\r\n        ")
    ;  feature.fields.forEach(field => { 
    ; __append("\r\n          <label>")
    ; __append(escapeFn( field.label ))
    ; __append("\r\n            ")
    ;  if (field.type === 'textarea') { 
    ; __append("\r\n              <textarea name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" rows=\"4\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">")
    ; __append(escapeFn( field.value ))
    ; __append("</textarea>\r\n            ")
    ;  } else if (field.type === 'select') { 
    ; __append("\r\n              <select name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">\r\n                ")
    ;  field.options.forEach(option => { 
    ; __append("<option value=\"")
    ; __append(escapeFn( option ))
    ; __append("\" ")
    ; __append(escapeFn( field.value === option ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( option ))
    ; __append("</option>")
    ;  }); 
    ; __append("\r\n              </select>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <input type=\"")
    ; __append(escapeFn( field.type || 'text' ))
    ; __append("\" name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" value=\"")
    ; __append(escapeFn( field.value ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">\r\n            ")
    ;  } 
    ; __append("\r\n          </label>\r\n        ")
    ;  }); 
    ; __append("\r\n        <button class=\"btn btn-primary\" type=\"submit\">Save Changes</button>\r\n        <p class=\"demo-feature-note\">Profile changes are stored only in this demo session. Uploads are unavailable.</p>\r\n      </form>\r\n    ")
    ;  } else if (feature.key === 'platform') { 
    ; __append("\r\n      <form class=\"demo-feature-form\" method=\"POST\">\r\n        <input type=\"hidden\" name=\"action\" value=\"")
    ; __append(escapeFn( feature.formAction ))
    ; __append("\">\r\n        ")
    ;  feature.fields.forEach(field => { 
    ; __append("\r\n          <label>")
    ; __append(escapeFn( field.label ))
    ; __append("\r\n            ")
    ;  if (field.type === 'select') { 
    ; __append("\r\n              <select name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">\r\n                ")
    ;  field.options.forEach(option => { 
    ; __append("<option value=\"")
    ; __append(escapeFn( option ))
    ; __append("\" ")
    ; __append(escapeFn( field.value === option ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( option ))
    ; __append("</option>")
    ;  }); 
    ; __append("\r\n              </select>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <input type=\"")
    ; __append(escapeFn( field.type || 'text' ))
    ; __append("\" name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" value=\"")
    ; __append(escapeFn( field.value ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">\r\n            ")
    ;  } 
    ; __append("\r\n          </label>\r\n        ")
    ;  }); 
    ; __append("\r\n        <button class=\"btn btn-primary\" type=\"submit\">Save Configuration</button>\r\n      </form>\r\n    ")
    ;  } else if (feature.fields.length) { 
    ; __append("\r\n      <form class=\"demo-feature-form\" method=\"POST\">\r\n        <input type=\"hidden\" name=\"action\" value=\"add\">\r\n        ")
    ;  feature.fields.forEach(field => { 
    ; __append("\r\n          <label>")
    ; __append(escapeFn( field.label ))
    ; __append("\r\n            ")
    ;  if (field.type === 'textarea') { 
    ; __append("\r\n              <textarea name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" rows=\"4\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append("></textarea>\r\n            ")
    ;  } else if (field.type === 'select') { 
    ; __append("\r\n              <select name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(">\r\n                ")
    ;  field.options.forEach(option => { 
    ; __append("<option value=\"")
    ; __append(escapeFn( option ))
    ; __append("\">")
    ; __append(escapeFn( option ))
    ; __append("</option>")
    ;  }); 
    ; __append("\r\n              </select>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <input type=\"")
    ; __append(escapeFn( field.type || 'text' ))
    ; __append("\" name=\"")
    ; __append(escapeFn( field.name ))
    ; __append("\" ")
    ; __append(escapeFn( field.required ? 'required' : '' ))
    ; __append(" ")
    ; __append(escapeFn( field.type === 'number' ? 'min="1"' : '' ))
    ; __append(">\r\n            ")
    ;  } 
    ; __append("\r\n          </label>\r\n        ")
    ;  }); 
    ; __append("\r\n        <button class=\"btn btn-primary\" type=\"submit\">Add to Demo</button>\r\n      </form>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  if (feature.records.length) { 
    ; __append("\r\n      <section class=\"demo-feature-grid\" aria-label=\"")
    ; __append(escapeFn( feature.title ))
    ; __append(" entries\">\r\n        ")
    ;  feature.records.forEach(record => { 
    ; __append("\r\n          <article class=\"demo-feature-card\">\r\n            <div style=\"display:flex;justify-content:space-between;gap:.75rem;align-items:flex-start;\">\r\n              <h2 style=\"font-size:1.1rem;margin:0;\">")
    ;  if (record.href) { 
    ; __append("<a href=\"")
    ; __append(escapeFn( record.href ))
    ; __append("\">")
    ; __append(escapeFn( record.title ))
    ; __append("</a>")
    ;  } else { 
    ; __append(escapeFn( record.title ))
    ;  } 
    ; __append("</h2>\r\n              ")
    ;  if (record.status) { 
    ; __append("<span class=\"demo-feature-status\">")
    ; __append(escapeFn( record.status ))
    ; __append("</span>")
    ;  } 
    ; __append("\r\n            </div>\r\n            ")
    ;  if (record.detail) { 
    ; __append("<p style=\"white-space:pre-wrap;\">")
    ; __append(escapeFn( record.detail ))
    ; __append("</p>")
    ;  } 
    ; __append("\r\n            ")
    ;  if (record.createdBy) { 
    ; __append("<p class=\"demo-feature-meta\">By ")
    ; __append(escapeFn( record.createdBy ))
    ; __append("</p>")
    ;  } 
    ; __append("\r\n            ")
    ;  if (feature.key === 'users') { 
    ; __append("\r\n              <form method=\"POST\" class=\"demo-feature-actions\">\r\n                <input type=\"hidden\" name=\"action\" value=\"status\">\r\n                <input type=\"hidden\" name=\"id\" value=\"")
    ; __append(escapeFn( record.id ))
    ; __append("\">\r\n                <select name=\"status\" aria-label=\"Change role for ")
    ; __append(escapeFn( record.title ))
    ; __append("\">\r\n                  ")
    ;  ['customer', 'employee', 'management', 'admin'].forEach(role => { 
    ; __append("<option value=\"")
    ; __append(escapeFn( role ))
    ; __append("\" ")
    ; __append(escapeFn( record.status === role ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( role ))
    ; __append("</option>")
    ;  }); 
    ; __append("\r\n                </select>\r\n                <button class=\"btn btn-secondary btn-sm\" type=\"submit\">Update Role</button>\r\n              </form>\r\n            ")
    ;  } else if (feature.key === 'suggestions' || feature.key === 'supportSuggestions') { 
    ; __append("\r\n              <div class=\"demo-feature-actions\">\r\n                ")
    ;  ['approved', 'completed', 'archived', 'rejected'].forEach(status => { 
    ; __append("\r\n                  <form method=\"POST\">\r\n                    <input type=\"hidden\" name=\"action\" value=\"status\">\r\n                    <input type=\"hidden\" name=\"id\" value=\"")
    ; __append(escapeFn( record.id ))
    ; __append("\">\r\n                    <input type=\"hidden\" name=\"status\" value=\"")
    ; __append(escapeFn( status ))
    ; __append("\">\r\n                    <button class=\"btn btn-secondary btn-sm\" type=\"submit\">")
    ; __append(escapeFn( status ))
    ; __append("</button>\r\n                  </form>\r\n                ")
    ;  }); 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else if (feature.key === 'shiftNotes') { 
    ; __append("\r\n              <div class=\"demo-feature-actions\">\r\n                ")
    ;  ['resolved', 'archived'].forEach(status => { 
    ; __append("\r\n                  <form method=\"POST\">\r\n                    <input type=\"hidden\" name=\"action\" value=\"status\">\r\n                    <input type=\"hidden\" name=\"id\" value=\"")
    ; __append(escapeFn( record.id ))
    ; __append("\">\r\n                    <input type=\"hidden\" name=\"status\" value=\"")
    ; __append(escapeFn( status ))
    ; __append("\">\r\n                    <button class=\"btn btn-secondary btn-sm\" type=\"submit\">")
    ; __append(escapeFn( status ))
    ; __append("</button>\r\n                  </form>\r\n                ")
    ;  }); 
    ; __append("\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n            ")
    ;  if (!record.href && !['audit', 'archivedNotes'].includes(feature.key)) { 
    ; __append("\r\n              <form method=\"POST\" class=\"demo-feature-actions\">\r\n                <input type=\"hidden\" name=\"action\" value=\"delete\">\r\n                <input type=\"hidden\" name=\"id\" value=\"")
    ; __append(escapeFn( record.id ))
    ; __append("\">\r\n                <button class=\"btn btn-danger btn-sm\" type=\"submit\">Remove</button>\r\n              </form>\r\n            ")
    ;  } 
    ; __append("\r\n          </article>\r\n        ")
    ;  }); 
    ; __append("\r\n      </section>\r\n    ")
    ;  } else if (feature.emptyText) { 
    ; __append("\r\n      <p class=\"demo-feature-card\">")
    ; __append(escapeFn( feature.emptyText ))
    ; __append("</p>\r\n    ")
    ;  } 
    ; __append("\r\n    <p class=\"demo-feature-note\">Demo mode: changes are scoped to your session and disappear when you log out. File uploads are disabled.</p>\r\n  </main>\r\n  ")
    ; __append( include('partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "discussion/index": function (locals, escapeFn, include, rethrow) {
var city = locals.city, commentFeed = locals.commentFeed, sidebar = locals.sidebar, user = locals.user;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Discussion Board - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"discussion-page container\">\r\n    <section class=\"discussion-hero-panel\">\r\n      <h1>Discussion Board</h1>\r\n      <p>Live recommendation activity from the concierge team, based on the newest comments and active threads.</p>\r\n      <div class=\"discussion-city-banner\">\r\n        <span class=\"badge-status badge-city\">Active Location: ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n        <span>Showing the most current recommendation conversations for this property.</span>\r\n      </div>\r\n    </section>\r\n\r\n    <div class=\"discussion-layout\">\r\n      <section class=\"discussion-main-column\">\r\n        <section class=\"discussion-header-row\">\r\n          <div>\r\n            <h2>Most Recent Recommendation Comments</h2>\r\n            <p class=\"muted-text\">Newest concierge notes and follow-ups from recommendation detail pages.</p>\r\n          </div>\r\n          <a href=\"/places\" class=\"btn btn-secondary\">View Recommendations</a>\r\n        </section>\r\n\r\n        <section class=\"discussion-posts-list\">\r\n          ")
    ;  if (commentFeed && commentFeed.length > 0) { 
    ; __append("\r\n            ")
    ;  commentFeed.forEach((entry) => { 
    ; __append("\r\n              <article class=\"discussion-post-card\" id=\"comment-")
    ; __append(escapeFn( entry.id ))
    ; __append("\">\r\n                <div class=\"discussion-post-head\">\r\n                  <div class=\"discussion-post-heading\">\r\n                    <h3><a href=\"/places/")
    ; __append(escapeFn( entry.place_id ))
    ; __append("\">")
    ; __append(escapeFn( entry.place_title ))
    ; __append("</a></h3>\r\n                    <p class=\"discussion-post-meta\">\r\n                      Comment by <strong>")
    ; __append(escapeFn( entry.username ))
    ; __append("</strong> on ")
    ; __append(escapeFn( new Date(entry.created_at).toLocaleString() ))
    ; __append("\r\n                    </p>\r\n                  </div>\r\n                  <div class=\"discussion-post-badges\">\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n                    <span class=\"badge-status badge-")
    ; __append(escapeFn( (entry.role || 'user').toLowerCase() ))
    ; __append("\">")
    ; __append(escapeFn( entry.role || 'user' ))
    ; __append("</span>\r\n                    <span class=\"badge-status\">")
    ; __append(escapeFn( entry.place_category ))
    ; __append("</span>\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"discussion-post-content\">\r\n                  <p>")
    ; __append(escapeFn( entry.comment_text ))
    ; __append("</p>\r\n                </div>\r\n\r\n                <div class=\"discussion-post-footer\">\r\n                  <div class=\"discussion-vote-text\">\r\n                    <strong>")
    ; __append(escapeFn( entry.thread_comment_count ))
    ; __append("</strong> comment")
    ; __append(escapeFn( entry.thread_comment_count === 1 ? '' : 's' ))
    ; __append("\r\n                    in this thread • <strong>")
    ; __append(escapeFn( entry.thread_like_count ))
    ; __append("</strong> like")
    ; __append(escapeFn( entry.thread_like_count === 1 ? '' : 's' ))
    ; __append("\r\n                  </div>\r\n                  <a href=\"/places/")
    ; __append(escapeFn( entry.place_id ))
    ; __append("#recommendation-comments\" class=\"btn btn-primary btn-sm\">Open Thread</a>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"empty-state\">\r\n              <div class=\"empty-state-icon\">Notes</div>\r\n              <p>No recommendation comments yet for this location.</p>\r\n              <a href=\"/places\" class=\"btn btn-primary\">Browse Recommendations</a>\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        </section>\r\n      </section>\r\n\r\n      <aside class=\"discussion-sidebar\">\r\n        <div class=\"discussion-sidebar-card\">\r\n          <div class=\"discussion-sidebar-tablist\" role=\"tablist\" aria-label=\"Discussion sidebar views\">\r\n            <button type=\"button\" class=\"discussion-sidebar-tab active\" data-sidebar-tab=\"active\" role=\"tab\" aria-selected=\"true\">Active Threads</button>\r\n            <button type=\"button\" class=\"discussion-sidebar-tab\" data-sidebar-tab=\"recent\" role=\"tab\" aria-selected=\"false\">Most Recent</button>\r\n            <button type=\"button\" class=\"discussion-sidebar-tab\" data-sidebar-tab=\"mine\" role=\"tab\" aria-selected=\"false\">My Comments</button>\r\n          </div>\r\n\r\n          <section class=\"discussion-sidebar-panel active\" data-sidebar-panel=\"active\" role=\"tabpanel\">\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>Active Threads</h3>\r\n            </div>\r\n            ")
    ;  if (sidebar.activeRecommendations.length > 0) { 
    ; __append("\r\n              <div class=\"discussion-sidebar-list\">\r\n                ")
    ;  sidebar.activeRecommendations.forEach((item) => { 
    ; __append("\r\n                  <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                    <div>\r\n                      <strong>")
    ; __append(escapeFn( item.title ))
    ; __append("</strong>\r\n                      <p>")
    ; __append(escapeFn( item.recentCommentCount ))
    ; __append(" comment")
    ; __append(escapeFn( item.recentCommentCount === 1 ? '' : 's' ))
    ; __append(" in last 7 days</p>\r\n                    </div>\r\n                    <div class=\"discussion-sidebar-item-badges\">\r\n                      <span class=\"badge-status\">")
    ; __append(escapeFn( item.category ))
    ; __append("</span>\r\n                    </div>\r\n                  </a>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">No active threads yet.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n\r\n          <section class=\"discussion-sidebar-panel\" data-sidebar-panel=\"recent\" role=\"tabpanel\" hidden>\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>Most Recent Threads</h3>\r\n            </div>\r\n            ")
    ;  if (sidebar.recentDiscussions.length > 0) { 
    ; __append("\r\n              <div class=\"discussion-sidebar-list\">\r\n                ")
    ;  sidebar.recentDiscussions.forEach((item) => { 
    ; __append("\r\n                  <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                    <div>\r\n                      <strong>")
    ; __append(escapeFn( item.title ))
    ; __append("</strong>\r\n                      <p>Last comment: ")
    ; __append(escapeFn( new Date(item.lastCommentAt).toLocaleDateString() ))
    ; __append("</p>\r\n                    </div>\r\n                    <div class=\"discussion-sidebar-item-badges\">\r\n                      <span class=\"badge-status\">")
    ; __append(escapeFn( item.commentCount ))
    ; __append(" total</span>\r\n                    </div>\r\n                  </a>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">No recent discussion activity yet.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n\r\n          <section class=\"discussion-sidebar-panel\" data-sidebar-panel=\"mine\" role=\"tabpanel\" hidden>\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>My Recent Comments</h3>\r\n            </div>\r\n            ")
    ;  if (user) { 
    ; __append("\r\n              ")
    ;  if (sidebar.myComments.length > 0) { 
    ; __append("\r\n                <div class=\"discussion-sidebar-list\">\r\n                  ")
    ;  sidebar.myComments.forEach((item) => { 
    ; __append("\r\n                    <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                      <div>\r\n                        <strong>")
    ; __append(escapeFn( item.placeTitle ))
    ; __append("</strong>\r\n                        <p>")
    ; __append(escapeFn( new Date(item.createdAt).toLocaleDateString() ))
    ; __append("</p>\r\n                        <p class=\"muted-text\">")
    ; __append(escapeFn( item.commentText.length > 80 ? `${item.commentText.slice(0, 80)}...` : item.commentText ))
    ; __append("</p>\r\n                      </div>\r\n                      <div class=\"discussion-sidebar-item-badges\">\r\n                        <span class=\"badge-status\">")
    ; __append(escapeFn( item.placeCategory ))
    ; __append("</span>\r\n                      </div>\r\n                    </a>\r\n                  ")
    ;  }) 
    ; __append("\r\n                </div>\r\n              ")
    ;  } else { 
    ; __append("\r\n                <p class=\"muted-text\">You have not posted recommendation comments yet.</p>\r\n              ")
    ;  } 
    ; __append("\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">Log in to view your comment activity.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n        </div>\r\n      </aside>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n\r\n  <script>\r\n    function activateSidebarTab(tabName) {\r\n      document.querySelectorAll('[data-sidebar-tab]').forEach((button) => {\r\n        const isActive = button.getAttribute('data-sidebar-tab') === tabName;\r\n        button.classList.toggle('active', isActive);\r\n        button.setAttribute('aria-selected', String(isActive));\r\n      });\r\n\r\n      document.querySelectorAll('[data-sidebar-panel]').forEach((panel) => {\r\n        const isActive = panel.getAttribute('data-sidebar-panel') === tabName;\r\n        panel.classList.toggle('active', isActive);\r\n        panel.hidden = !isActive;\r\n      });\r\n    }\r\n\r\n    document.querySelectorAll('[data-sidebar-tab]').forEach((button) => {\r\n      button.addEventListener('click', function () {\r\n        activateSidebarTab(this.getAttribute('data-sidebar-tab'));\r\n      });\r\n    });\r\n  </script>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "discussion/new": function (locals, escapeFn, include, rethrow) {
var draft = locals.draft, formMode = locals.formMode, city = locals.city, user = locals.user, itemOptionsByType = locals.itemOptionsByType;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Create Discussion Post - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n  <style>\r\n    .post-form-container {\r\n      max-width: 700px;\r\n      margin: 40px auto;\r\n      padding: 0 20px;\r\n    }\r\n\r\n    .form-card {\r\n      background: white;\r\n      border: 1px solid #ddd;\r\n      border-radius: 8px;\r\n      padding: 30px;\r\n      box-shadow: 0 2px 8px rgba(0,0,0,0.1);\r\n    }\r\n\r\n    .form-card h1 {\r\n      margin-top: 0;\r\n      color: #333;\r\n      text-align: center;\r\n    }\r\n\r\n    .form-group {\r\n      margin-bottom: 20px;\r\n    }\r\n\r\n    .form-group label {\r\n      display: block;\r\n      font-weight: bold;\r\n      margin-bottom: 8px;\r\n      color: #333;\r\n    }\r\n\r\n    .form-group input[type=\"text\"],\r\n    .form-group input[type=\"number\"],\r\n    .form-group textarea,\r\n    .form-group select {\r\n      width: 100%;\r\n      padding: 10px;\r\n      border: 1px solid #ddd;\r\n      border-radius: 5px;\r\n      font-family: Arial, sans-serif;\r\n      font-size: 14px;\r\n      box-sizing: border-box;\r\n    }\r\n\r\n    .form-group input[type=\"text\"]:focus,\r\n    .form-group input[type=\"number\"]:focus,\r\n    .form-group textarea:focus,\r\n    .form-group select:focus {\r\n      outline: none;\r\n      border-color: #667eea;\r\n      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\r\n    }\r\n\r\n    .form-group textarea {\r\n      resize: vertical;\r\n      min-height: 150px;\r\n    }\r\n\r\n    .form-hint {\r\n      font-size: 12px;\r\n      color: #999;\r\n      margin-top: 5px;\r\n    }\r\n\r\n    .form-row {\r\n      display: grid;\r\n      grid-template-columns: 1fr 1fr;\r\n      gap: 20px;\r\n    }\r\n\r\n    .submit-group {\r\n      display: flex;\r\n      gap: 10px;\r\n      margin-top: 30px;\r\n    }\r\n\r\n    .btn-submit {\r\n      flex: 1;\r\n      padding: 12px 20px;\r\n      background-color: #667eea;\r\n      color: white;\r\n      border: none;\r\n      border-radius: 5px;\r\n      font-size: 16px;\r\n      font-weight: bold;\r\n      cursor: pointer;\r\n      transition: background-color 0.3s;\r\n    }\r\n\r\n    .btn-submit:hover {\r\n      background-color: #5568d3;\r\n    }\r\n\r\n    .btn-cancel {\r\n      flex: 1;\r\n      padding: 12px 20px;\r\n      background-color: #f0f0f0;\r\n      color: #333;\r\n      border: 1px solid #ddd;\r\n      border-radius: 5px;\r\n      font-size: 16px;\r\n      font-weight: bold;\r\n      cursor: pointer;\r\n      text-decoration: none;\r\n      text-align: center;\r\n      transition: background-color 0.3s;\r\n    }\r\n\r\n    .btn-cancel:hover {\r\n      background-color: #e8e8e8;\r\n    }\r\n\r\n    .post-type-info {\r\n      background-color: #f5f5f5;\r\n      padding: 10px;\r\n      border-radius: 5px;\r\n      font-size: 12px;\r\n      color: #666;\r\n      margin-top: 5px;\r\n    }\r\n\r\n    .tags-help {\r\n      background-color: #f9f9f9;\r\n      padding: 12px;\r\n      border-left: 4px solid #667eea;\r\n      margin-bottom: 20px;\r\n      font-size: 13px;\r\n      color: #666;\r\n    }\r\n\r\n    .error-message {\r\n      background-color: #fee;\r\n      color: #c33;\r\n      padding: 10px;\r\n      border-radius: 5px;\r\n      margin-bottom: 20px;\r\n    }\r\n\r\n    .tags-input-wrap {\r\n      border: 1px solid #ddd;\r\n      border-radius: 5px;\r\n      padding: 8px;\r\n      display: flex;\r\n      flex-wrap: wrap;\r\n      gap: 8px;\r\n      align-items: center;\r\n      min-height: 44px;\r\n    }\r\n\r\n    .tags-input-wrap:focus-within {\r\n      border-color: #667eea;\r\n      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\r\n    }\r\n\r\n    .tag-chip {\r\n      display: inline-flex;\r\n      align-items: center;\r\n      gap: 6px;\r\n      background: #e8f0ff;\r\n      color: #2c3e80;\r\n      border-radius: 999px;\r\n      padding: 4px 10px;\r\n      font-size: 12px;\r\n      font-weight: 600;\r\n    }\r\n\r\n    .tag-remove-btn {\r\n      border: none;\r\n      background: transparent;\r\n      color: #2c3e80;\r\n      cursor: pointer;\r\n      font-size: 13px;\r\n      line-height: 1;\r\n      padding: 0;\r\n    }\r\n\r\n    .tag-entry-input {\r\n      border: none;\r\n      outline: none;\r\n      flex: 1;\r\n      min-width: 180px;\r\n      font-family: Arial, sans-serif;\r\n      font-size: 14px;\r\n      padding: 4px;\r\n    }\r\n\r\n    .suggested-tags {\r\n      display: flex;\r\n      flex-wrap: wrap;\r\n      gap: 8px;\r\n      margin-top: 10px;\r\n    }\r\n\r\n    .suggested-tag-btn {\r\n      border: 1px solid #cbd5e1;\r\n      background: #f8fafc;\r\n      color: #334155;\r\n      border-radius: 999px;\r\n      padding: 4px 10px;\r\n      font-size: 12px;\r\n      cursor: pointer;\r\n      transition: all 0.2s;\r\n    }\r\n\r\n    .suggested-tag-btn:hover {\r\n      border-color: #94a3b8;\r\n      background: #f1f5f9;\r\n    }\r\n  </style>\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  ")
    ;  const draftData = draft || {}; 
    ; __append("\r\n  ")
    ;  const initialTags = draftData.tags ? draftData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []; 
    ; __append("\r\n\r\n  <div class=\"post-form-container\">\r\n    <div class=\"form-card\">\r\n      <h1>")
    ; __append(escapeFn( formMode === 'edit' ? 'Continue Draft' : 'Share a Recommendation' ))
    ; __append("</h1>\r\n      <div class=\"discussion-city-banner discussion-city-banner-compact\">\r\n        <span class=\"badge-status badge-city\">Posting To: ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n        <span>This post will only appear in the ")
    ; __append(escapeFn( city ))
    ; __append(" discussion workspace.</span>\r\n      </div>\r\n\r\n      <form method=\"POST\" action=\"/discussion/new\">\r\n        ")
    ;  if (draftData.id) { 
    ; __append("\r\n          <input type=\"hidden\" name=\"draft_id\" value=\"")
    ; __append(escapeFn( draftData.id ))
    ; __append("\">\r\n        ")
    ;  } 
    ; __append("\r\n        <div class=\"tags-help\">\r\n          💡 <strong>Tip:</strong> Share places you recommend or events you think your team should know about. Save a draft if you are not ready to publish yet.\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"title\">Title *</label>\r\n          <input \r\n            type=\"text\" \r\n            id=\"title\" \r\n            name=\"title\" \r\n            required \r\n            placeholder=\"e.g., Amazing New Brunch Spot Downtown\"\r\n            maxlength=\"255\"\r\n            value=\"")
    ; __append(escapeFn( draftData.title || '' ))
    ; __append("\"\r\n          >\r\n        </div>\r\n\r\n        <div class=\"form-row\">\r\n          <div class=\"form-group\">\r\n            <label for=\"post_type\">Type *</label>\r\n            <select id=\"post_type\" name=\"post_type\" required>\r\n              <option value=\"\">Select type...</option>\r\n              <option value=\"place\" ")
    ; __append(escapeFn( draftData.post_type === 'place' ? 'selected' : '' ))
    ; __append(">Place</option>\r\n              <option value=\"event\" ")
    ; __append(escapeFn( draftData.post_type === 'event' ? 'selected' : '' ))
    ; __append(">Event</option>\r\n              <option value=\"attraction\" ")
    ; __append(escapeFn( draftData.post_type === 'attraction' ? 'selected' : '' ))
    ; __append(">Attraction</option>\r\n            </select>\r\n            <div class=\"post-type-info\">\r\n              Choose the high-level recommendation type.\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"form-group\">\r\n            <label for=\"item_id\" id=\"item_label\">Select Category *</label>\r\n            <select id=\"item_id\" name=\"item_id\" required>\r\n              <option value=\"\">Choose a category type first...</option>\r\n            </select>\r\n            <div class=\"form-hint\" id=\"item_hint\">Pick a category (for example museum, aquarium, bar, or restaurant).</div>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"content\">Details & Recommendation *</label>\r\n          <textarea \r\n            id=\"content\" \r\n            name=\"content\" \r\n            required \r\n            placeholder=\"Share your experience, why you recommend this, special notes for guests, etc.\"\r\n          >")
    ; __append(escapeFn( draftData.content || '' ))
    ; __append("</textarea>\r\n          <div class=\"form-hint\">Be specific! Share what makes this place/event special.</div>\r\n        </div>\r\n\r\n        ")
    ;  if (user && user.role === 'admin') { 
    ; __append("\r\n          <div class=\"form-group\">\r\n            <label class=\"draft-checkbox-row\" for=\"is_pinned\">\r\n              <input type=\"checkbox\" id=\"is_pinned\" name=\"is_pinned\" value=\"1\" ")
    ; __append(escapeFn( draftData.is_pinned ? 'checked' : '' ))
    ; __append(">\r\n              <span>Pin this post in the discussion board sidebar</span>\r\n            </label>\r\n            <div class=\"form-hint\">Pinned posts appear in the dedicated sidebar tab for quick access.</div>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"tag_input\">Tags (Optional)</label>\r\n          <div class=\"tags-input-wrap\" id=\"tags_input_wrap\">\r\n            <input\r\n              type=\"text\"\r\n              id=\"tag_input\"\r\n              class=\"tag-entry-input\"\r\n              placeholder=\"Type a tag and press Enter\"\r\n              autocomplete=\"off\"\r\n            >\r\n          </div>\r\n          <input type=\"hidden\" id=\"tags\" name=\"tags\" value=\"")
    ; __append(escapeFn( draftData.tags || '' ))
    ; __append("\">\r\n          <div class=\"form-hint\">Press Enter to add each tag. Up to 10 tags.</div>\r\n          <div class=\"suggested-tags\" id=\"suggested_tags\">\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"family-friendly\">#family-friendly</button>\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"romantic\">#romantic</button>\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"live-music\">#live-music</button>\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"upscale\">#upscale</button>\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"budget-friendly\">#budget-friendly</button>\r\n            <button type=\"button\" class=\"suggested-tag-btn\" data-tag=\"group-friendly\">#group-friendly</button>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"submit-group\">\r\n          <a href=\"/discussion\" class=\"btn-cancel\">Cancel</a>\r\n          <button type=\"submit\" formaction=\"/discussion/drafts/save\" formnovalidate class=\"btn-cancel\">")
    ; __append(escapeFn( formMode === 'edit' ? 'Update Draft' : 'Save Draft' ))
    ; __append("</button>\r\n          <button type=\"submit\" class=\"btn-submit\">")
    ; __append(escapeFn( formMode === 'edit' ? 'Publish Draft' : 'Share Recommendation' ))
    ; __append("</button>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n\r\n  <script id=\"discussion-draft-config\" type=\"application/json\">")
    ; __append( JSON.stringify({
    postType: draftData.post_type || '',
    itemId: draftData.item_id || '',
    tags: initialTags,
    itemOptionsByType: itemOptionsByType || {}
  }).replace(/</g, '\\u003c') )
    ; __append("</script>\r\n\r\n  <script>\r\n    const draftConfig = JSON.parse(document.getElementById('discussion-draft-config').textContent || '{}');\r\n    const tagsHiddenInput = document.getElementById('tags');\r\n    const tagInput = document.getElementById('tag_input');\r\n    const tagsInputWrap = document.getElementById('tags_input_wrap');\r\n    const itemHint = document.getElementById('item_hint');\r\n    const tagsList = [];\r\n    const initialPostType = draftConfig.postType || '';\r\n    const initialItemId = draftConfig.itemId ? String(draftConfig.itemId) : '';\r\n    const initialTags = Array.isArray(draftConfig.tags) ? draftConfig.tags : [];\r\n\r\n    const itemOptionsByType = draftConfig.itemOptionsByType || {};\r\n\r\n    function syncTagsToHiddenInput() {\r\n      tagsHiddenInput.value = tagsList.join(',');\r\n    }\r\n\r\n    function removeTag(tagValue) {\r\n      const index = tagsList.findIndex(tag => tag.toLowerCase() === tagValue.toLowerCase());\r\n      if (index >= 0) {\r\n        tagsList.splice(index, 1);\r\n        renderTags();\r\n      }\r\n    }\r\n\r\n    function renderTags() {\r\n      const existingChips = tagsInputWrap.querySelectorAll('.tag-chip');\r\n      existingChips.forEach(chip => chip.remove());\r\n\r\n      tagsList.forEach(tag => {\r\n        const chip = document.createElement('span');\r\n        chip.className = 'tag-chip';\r\n        chip.textContent = `#${tag}`;\r\n\r\n        const removeBtn = document.createElement('button');\r\n        removeBtn.type = 'button';\r\n        removeBtn.className = 'tag-remove-btn';\r\n        removeBtn.setAttribute('aria-label', `Remove tag ${tag}`);\r\n        removeBtn.textContent = 'x';\r\n        removeBtn.addEventListener('click', () => removeTag(tag));\r\n\r\n        chip.appendChild(removeBtn);\r\n        tagsInputWrap.insertBefore(chip, tagInput);\r\n      });\r\n\r\n      syncTagsToHiddenInput();\r\n    }\r\n\r\n    function addTag(rawValue) {\r\n      const tagValue = rawValue.trim().replace(/^#+/, '');\r\n      if (!tagValue) return;\r\n\r\n      const isDuplicate = tagsList.some(tag => tag.toLowerCase() === tagValue.toLowerCase());\r\n      if (isDuplicate) return;\r\n\r\n      if (tagsList.length >= 10) {\r\n        alert('Maximum 10 tags allowed');\r\n        return;\r\n      }\r\n\r\n      if (tagValue.length > 50) {\r\n        alert('Tag is too long (max 50 characters)');\r\n        return;\r\n      }\r\n\r\n      tagsList.push(tagValue);\r\n      renderTags();\r\n    }\r\n\r\n    function updateItemsList(selectedValue = '') {\r\n      const type = document.getElementById('post_type').value;\r\n      const itemLabel = document.getElementById('item_label');\r\n      const itemSelect = document.getElementById('item_id');\r\n      \r\n      itemSelect.innerHTML = '<option value=\"\">Choose...</option>';\r\n\r\n      itemLabel.textContent = 'Select Category *';\r\n      const options = itemOptionsByType[type] || [];\r\n\r\n      if (!options.length) {\r\n        itemHint.textContent = 'Pick a type first to see descriptive item categories.';\r\n        return;\r\n      }\r\n\r\n      itemHint.textContent = 'Choose the category that best fits your recommendation.';\r\n      options.forEach(item => {\r\n        const option = document.createElement('option');\r\n        option.value = String(item.value);\r\n        option.textContent = item.label;\r\n        if (selectedValue && selectedValue === String(item.value)) {\r\n          option.selected = true;\r\n        }\r\n        itemSelect.appendChild(option);\r\n      });\r\n    }\r\n\r\n    document.getElementById('post_type').addEventListener('change', updateItemsList);\r\n\r\n    tagInput.addEventListener('keydown', function(e) {\r\n      if (e.key === 'Enter' || e.key === ',') {\r\n        e.preventDefault();\r\n        addTag(tagInput.value);\r\n        tagInput.value = '';\r\n      } else if (e.key === 'Backspace' && !tagInput.value && tagsList.length > 0) {\r\n        tagsList.pop();\r\n        renderTags();\r\n      }\r\n    });\r\n\r\n    tagsInputWrap.addEventListener('click', function() {\r\n      tagInput.focus();\r\n    });\r\n\r\n    document.querySelectorAll('.suggested-tag-btn').forEach(button => {\r\n      button.addEventListener('click', function() {\r\n        addTag(this.dataset.tag || '');\r\n        tagInput.focus();\r\n      });\r\n    });\r\n\r\n    initialTags.forEach(addTag);\r\n\r\n    if (initialPostType) {\r\n      updateItemsList(initialItemId);\r\n    }\r\n\r\n    // Forms validation\r\n    document.querySelector('form').addEventListener('submit', function(e) {\r\n      if (tagInput.value.trim()) {\r\n        addTag(tagInput.value);\r\n        tagInput.value = '';\r\n      }\r\n\r\n      if (tagsList.length > 10) {\r\n        e.preventDefault();\r\n        alert('Maximum 10 tags allowed');\r\n        return false;\r\n      }\r\n    });\r\n  </script>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "employee/index": function (locals, escapeFn, include, rethrow) {
var user = locals.user, city = locals.city;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  ")
    ;  const activeRole = (user && user.role ? user.role.toLowerCase() : 'employee'); 
    ; __append("\r\n  ")
    ;  const workspaceTitleMap = {
    employee: 'Employee Workspace',
    management: 'Management Operations Workspace',
    maintenance: 'Maintenance Workspace',
    it: 'IT Workspace',
    housekeeping: 'Housekeeping Workspace',
    admin: 'Administrator Operations Workspace'
  }; 
    ; __append("\r\n  ")
    ;  const workspaceDescriptionMap = {
    employee: 'Collaborate with team members, share recommendations, and discover new events and places to recommend to guests.',
    management: 'Coordinate teams, oversee service quality, and keep daily operations moving smoothly across the property.',
    maintenance: 'Track service requests, monitor operational tasks, and keep facilities running reliably for guests and staff.',
    it: 'Manage technical incidents, support team systems, and keep operational technology healthy across the property.',
    housekeeping: 'Coordinate room-readiness updates, respond to service needs, and keep guest-facing spaces in top condition.',
    admin: 'Monitor operational workflows, coordinate support teams, and keep property systems aligned.'
  }; 
    ; __append("\r\n  ")
    ;  const workspaceTitle = workspaceTitleMap[activeRole] || workspaceTitleMap.employee; 
    ; __append("\r\n  ")
    ;  const workspaceDescription = workspaceDescriptionMap[activeRole] || workspaceDescriptionMap.employee; 
    ; __append("\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( workspaceTitle ))
    ; __append(" - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-employee\">\r\n    <section class=\"workspace-hero\">\r\n      <div class=\"container\">\r\n        <h1>")
    ; __append(escapeFn( workspaceTitle.toUpperCase() ))
    ; __append("</h1>\r\n        <p>")
    ; __append(escapeFn( workspaceDescription ))
    ; __append("</p>\r\n        <div class=\"workspace-location-banner\">\r\n          <span class=\"badge-status badge-city\">Active Location: ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n          <span class=\"workspace-location-copy\">Your workspace is showing only content for this property.</span>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container workspace-grid\">\r\n      <div class=\"workspace-card\">\r\n        <h2>Browse Recommendations</h2>\r\n        <p>Explore all approved recommendations for this property — restaurants, bars, entertainment, and more.</p>\r\n        <a href=\"/places\" class=\"btn btn-primary\">Browse Recommendations</a>\r\n      </div>\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Shift Notes</h2>\r\n        <p>Maintain internal notes for handoff between concierge shifts.</p>\r\n        <a href=\"/employee/shift-notes\" class=\"btn btn-secondary\">Open Shift Notes</a>\r\n      </div>\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Staff Tickets</h2>\r\n        <p>Submit requests or issues to Management, Maintenance, or IT and track their status.</p>\r\n        <a href=\"/employee/tickets\" class=\"btn btn-secondary\">Open Tickets</a>\r\n      </div>\r\n\r\n      <div class=\"workspace-card\">\r\n        <h2>Team Directory</h2>\r\n        <p>View coworker account details for the current property without opening anyone else’s settings.</p>\r\n        <a href=\"/account/team\" class=\"btn btn-secondary\">Browse Team Accounts</a>\r\n      </div>\r\n\r\n      ")
    ;  if (['employee', 'management', 'admin'].includes(activeRole)) { 
    ; __append("\r\n      <div class=\"workspace-card\">\r\n        <h2>Discussion Board</h2>\r\n        <p>Share updates and discuss recommendations with the team.</p>\r\n        <a href=\"/discussion\" class=\"btn btn-secondary\">Open Discussion Board</a>\r\n      </div>\r\n      ")
    ;  } 
    ; __append("\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "employee/shift-notes": function (locals, escapeFn, include, rethrow) {
var message = locals.message, isAdmin = locals.isAdmin, notes = locals.notes, user = locals.user;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Shift Notes - SOVA Employee</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-employee\">\r\n    <section class=\"workspace-hero\">\r\n      <div class=\"container\">\r\n        <h1>Shift Notes</h1>\r\n        <p>Capture handoff details so the next concierge shift can pick up instantly.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container shift-notes-layout\">\r\n      <section class=\"workspace-card shift-notes-form-card\">\r\n        <h2>New Shift Note</h2>\r\n        ")
    ;  if (message) { 
    ; __append("\r\n          <p class=\"admin-inline-message\">")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <form method=\"POST\" action=\"/employee/shift-notes\" class=\"shift-notes-form\">\r\n          <div class=\"shift-notes-row\">\r\n            <div class=\"form-group\">\r\n              <label for=\"shiftDate\">Date</label>\r\n              <input id=\"shiftDate\" name=\"shiftDate\" type=\"date\" required>\r\n            </div>\r\n\r\n            <div class=\"form-group\">\r\n              <label for=\"shiftLabel\">Shift</label>\r\n              <select id=\"shiftLabel\" name=\"shiftLabel\" required>\r\n                <option value=\"morning\">Morning</option>\r\n                <option value=\"afternoon\" selected>Afternoon</option>\r\n                <option value=\"night\">Night</option>\r\n              </select>\r\n            </div>\r\n\r\n            <div class=\"form-group\">\r\n              <label for=\"priority\">Priority</label>\r\n              <select id=\"priority\" name=\"priority\" required>\r\n                <option value=\"normal\" selected>Normal</option>\r\n                <option value=\"urgent\">Urgent</option>\r\n              </select>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"form-group\">\r\n            <label for=\"noteCategory\">Category</label>\r\n            <select id=\"noteCategory\" name=\"noteCategory\" required>\r\n              <option value=\"guest\">Guest</option>\r\n              <option value=\"employees\" selected>Employees</option>\r\n              <option value=\"management_maintenance\">Management / Maintenance</option>\r\n            </select>\r\n          </div>\r\n\r\n          <div class=\"form-group\">\r\n            <label for=\"noteText\">Note</label>\r\n            <textarea id=\"noteText\" name=\"noteText\" maxlength=\"2000\" rows=\"6\" required placeholder=\"Include unresolved guest needs, recommendations to follow up, and anything the next shift should know.\"></textarea>\r\n          </div>\r\n\r\n          <button type=\"submit\" class=\"btn btn-primary\">Save Shift Note</button>\r\n        </form>\r\n      </section>\r\n\r\n      <section class=\"workspace-card shift-notes-list-card\">\r\n        <div class=\"shift-notes-list-head\">\r\n          <h2>Active Shift Notes</h2>\r\n          ")
    ;  if (isAdmin) { 
    ; __append("\r\n            <a href=\"/admin/shift-notes/archive\" class=\"btn btn-secondary btn-sm\">View Archive</a>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n        <p class=\"muted-text\">Notes auto-archive after 24 hours if not resolved.</p>\r\n        ")
    ;  if (notes && notes.length > 0) { 
    ; __append("\r\n          <div class=\"shift-notes-list\">\r\n            ")
    ;  notes.forEach(note => { 
    ; __append("\r\n              ")
    ;  const isOwnNote = user && user.id === note.created_by; 
    ; __append("\r\n              ")
    ;  const canEditWithinWindow = isOwnNote && Number(note.age_seconds || 0) <= 300; 
    ; __append("\r\n              ")
    ;  const initials = (note.username || '')
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('') || '?'; 
    ; __append("\r\n              <article class=\"shift-note-item\">\r\n                <div class=\"shift-note-head\">\r\n                  <div>\r\n                    <strong>")
    ; __append(escapeFn( new Date(note.shift_date).toLocaleDateString() ))
    ; __append(" • ")
    ; __append(escapeFn( note.shift_label.charAt(0).toUpperCase() + note.shift_label.slice(1) ))
    ; __append("</strong>\r\n                    <p>By ")
    ; __append(escapeFn( note.username ))
    ; __append(" • ")
    ; __append(escapeFn( new Date(note.created_at).toLocaleString() ))
    ; __append("</p>\r\n                  </div>\r\n                  <div class=\"shift-note-badges\">\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( note.note_category === 'guest' ? 'badge-note-guest' : note.note_category === 'management_maintenance' ? 'badge-note-management' : 'badge-note-employees' ))
    ; __append("\">\r\n                      ")
    ; __append(escapeFn( note.note_category === 'guest' ? 'Guest' : note.note_category === 'management_maintenance' ? 'Mgmt/Maintenance' : 'Employees' ))
    ; __append("\r\n                    </span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( note.priority === 'urgent' ? 'badge-cancelled' : 'badge-confirmed' ))
    ; __append("\">")
    ; __append(escapeFn( note.priority ))
    ; __append("</span>\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( initials ))
    ; __append("</span>\r\n                  </div>\r\n                </div>\r\n\r\n                ")
    ;  if (canEditWithinWindow) { 
    ; __append("\r\n                  <form method=\"POST\" action=\"/employee/shift-notes/")
    ; __append(escapeFn( note.id ))
    ; __append("/edit\" class=\"shift-note-edit-form\">\r\n                    <label for=\"edit-note-")
    ; __append(escapeFn( note.id ))
    ; __append("\" class=\"muted-text\">Edit note (within 5 minutes of submission)</label>\r\n                    <textarea id=\"edit-note-")
    ; __append(escapeFn( note.id ))
    ; __append("\" name=\"noteText\" maxlength=\"2000\" rows=\"4\" required>")
    ; __append(escapeFn( note.note_text ))
    ; __append("</textarea>\r\n                    <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Save Edit</button>\r\n                  </form>\r\n                ")
    ;  } else { 
    ; __append("\r\n                  <p class=\"shift-note-body\">")
    ; __append(escapeFn( note.note_text ))
    ; __append("</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <div class=\"shift-note-actions\">\r\n                  <form method=\"POST\" action=\"/employee/shift-notes/")
    ; __append(escapeFn( note.id ))
    ; __append("/resolve\" class=\"shift-note-resolve\">\r\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\">Mark Resolved</button>\r\n                  </form>\r\n\r\n                  ")
    ;  if (user && (((user.role || '').toLowerCase() === 'admin') || user.id === note.created_by)) { 
    ; __append("\r\n                    <form method=\"POST\" action=\"/employee/shift-notes/")
    ; __append(escapeFn( note.id ))
    ; __append("/delete\" class=\"shift-note-delete\">\r\n                      <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Delete</button>\r\n                    </form>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </article>\r\n            ")
    ;  }); 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">No shift notes yet. Add the first handoff note.</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n\r\n  <script>\r\n    const dateInput = document.getElementById('shiftDate');\r\n    if (dateInput && !dateInput.value) {\r\n      dateInput.value = new Date().toISOString().slice(0, 10);\r\n    }\r\n  </script>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "employee/tickets": function (locals, escapeFn, include, rethrow) {
var message = locals.message, isAdmin = locals.isAdmin, tickets = locals.tickets, user = locals.user;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Staff Tickets - SOVA Employee</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"workspace-page workspace-employee\">\r\n    <section class=\"workspace-hero\">\r\n      <div class=\"container\">\r\n        <h1>Staff Tickets</h1>\r\n        <p>Submit requests to Management, Maintenance, or IT. Track the status of tickets you've submitted.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"container shift-notes-layout\">\r\n      <section class=\"workspace-card shift-notes-form-card\">\r\n        <h2>New Ticket</h2>\r\n        ")
    ;  if (message) { 
    ; __append("\r\n          <p class=\"admin-inline-message\">")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <form method=\"POST\" action=\"/employee/tickets\" class=\"shift-notes-form\">\r\n          <div class=\"form-group\">\r\n            <label for=\"ticketTitle\">Title</label>\r\n            <input id=\"ticketTitle\" name=\"title\" type=\"text\" maxlength=\"200\" required placeholder=\"Brief summary of the issue or request\">\r\n          </div>\r\n\r\n          <div class=\"shift-notes-row\">\r\n            <div class=\"form-group\">\r\n              <label for=\"ticketDepartment\">Department</label>\r\n              <select id=\"ticketDepartment\" name=\"department\" required>\r\n                <option value=\"management\">Management</option>\r\n                <option value=\"maintenance\">Maintenance</option>\r\n                <option value=\"it\">IT</option>\r\n              </select>\r\n            </div>\r\n\r\n            <div class=\"form-group\">\r\n              <label for=\"ticketPriority\">Priority</label>\r\n              <select id=\"ticketPriority\" name=\"priority\" required>\r\n                <option value=\"normal\" selected>Normal</option>\r\n                <option value=\"urgent\">Urgent</option>\r\n              </select>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"form-group\">\r\n            <label for=\"ticketDescription\">Description</label>\r\n            <textarea id=\"ticketDescription\" name=\"description\" maxlength=\"3000\" rows=\"6\" required placeholder=\"Describe the issue in detail — include location, time, affected guests or equipment, and any steps already taken.\"></textarea>\r\n          </div>\r\n\r\n          <button type=\"submit\" class=\"btn btn-primary\">Submit Ticket</button>\r\n        </form>\r\n      </section>\r\n\r\n      <section class=\"workspace-card shift-notes-list-card\">\r\n        <div class=\"shift-notes-list-head\">\r\n          <h2>")
    ; __append(escapeFn( isAdmin ? 'All Open Tickets' : 'My Tickets' ))
    ; __append("</h2>\r\n          ")
    ;  if (isAdmin) { 
    ; __append("\r\n            <a href=\"/admin/tickets\" class=\"btn btn-secondary btn-sm\">Full Ticket Board</a>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n        <p class=\"muted-text\">")
    ; __append(escapeFn( isAdmin ? 'Showing all open and in-progress tickets for this property.' : 'Showing your open and in-progress tickets.' ))
    ; __append("</p>\r\n\r\n        ")
    ;  if (tickets && tickets.length > 0) { 
    ; __append("\r\n          <div class=\"shift-notes-list\">\r\n            ")
    ;  tickets.forEach(ticket => { 
    ; __append("\r\n              ")
    ;  const isOwnTicket = user && user.id === ticket.created_by; 
    ; __append("\r\n              ")
    ;  const initials = (ticket.created_by_username || '')
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('') || '?'; 
    ; __append("\r\n              ")
    ;  const deptLabel = ticket.department === 'it' ? 'IT' : ticket.department.charAt(0).toUpperCase() + ticket.department.slice(1); 
    ; __append("\r\n\r\n              <article class=\"shift-note-item\">\r\n                <div class=\"shift-note-head\">\r\n                  <div>\r\n                    <strong>")
    ; __append(escapeFn( ticket.title ))
    ; __append("</strong>\r\n                    <p>By ")
    ; __append(escapeFn( ticket.created_by_username ))
    ; __append(" &bull; ")
    ; __append(escapeFn( new Date(ticket.created_at).toLocaleString() ))
    ; __append("</p>\r\n                  </div>\r\n                  <div class=\"shift-note-badges\">\r\n                    <span class=\"badge-status ticket-badge-dept-")
    ; __append(escapeFn( ticket.department ))
    ; __append("\">")
    ; __append(escapeFn( deptLabel ))
    ; __append("</span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( ticket.priority === 'urgent' ? 'badge-cancelled' : 'badge-confirmed' ))
    ; __append("\">")
    ; __append(escapeFn( ticket.priority ))
    ; __append("</span>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( ticket.status === 'open' ? 'badge-pending' : ticket.status === 'in_progress' ? 'badge-city' : 'badge-approved' ))
    ; __append("\">\r\n                      ")
    ; __append(escapeFn( ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) ))
    ; __append("\r\n                    </span>\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( initials ))
    ; __append("</span>\r\n                  </div>\r\n                </div>\r\n\r\n                <p class=\"shift-note-body\">")
    ; __append(escapeFn( ticket.description ))
    ; __append("</p>\r\n\r\n                ")
    ;  if (ticket.resolution_note) { 
    ; __append("\r\n                  <p class=\"shift-note-meta ticket-resolution-note\"><strong>Resolution:</strong> ")
    ; __append(escapeFn( ticket.resolution_note ))
    ; __append("</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                ")
    ;  if (isAdmin) { 
    ; __append("\r\n                  <div class=\"shift-note-actions\">\r\n                    <form method=\"POST\" action=\"/employee/tickets/")
    ; __append(escapeFn( ticket.id ))
    ; __append("/status\" class=\"ticket-status-form\">\r\n                      <select name=\"status\" class=\"ticket-inline-select\" aria-label=\"Update status\">\r\n                        <option value=\"open\" ")
    ; __append(escapeFn( ticket.status === 'open' ? 'selected' : '' ))
    ; __append(">Open</option>\r\n                        <option value=\"in_progress\" ")
    ; __append(escapeFn( ticket.status === 'in_progress' ? 'selected' : '' ))
    ; __append(">In Progress</option>\r\n                        <option value=\"resolved\" ")
    ; __append(escapeFn( ticket.status === 'resolved' ? 'selected' : '' ))
    ; __append(">Resolved</option>\r\n                        <option value=\"closed\" ")
    ; __append(escapeFn( ticket.status === 'closed' ? 'selected' : '' ))
    ; __append(">Closed</option>\r\n                      </select>\r\n                      <input type=\"text\" name=\"resolutionNote\" class=\"ticket-inline-note\" maxlength=\"500\" placeholder=\"Resolution note (optional)\">\r\n                      <button type=\"submit\" class=\"btn btn-primary btn-sm\">Update</button>\r\n                    </form>\r\n                  </div>\r\n                ")
    ;  } 
    ; __append("\r\n              </article>\r\n            ")
    ;  }); 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">")
    ; __append(escapeFn( isAdmin ? 'No open tickets for this property.' : 'You have no open tickets.' ))
    ; __append("</p>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "error": function (locals, escapeFn, include, rethrow) {
var message = locals.message;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Error - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  <div class=\"container\">\r\n    <div class=\"error-page\">\r\n      <h1>⚠️ Error</h1>\r\n      <p>")
    ; __append(escapeFn( message ))
    ; __append("</p>\r\n      <a href=\"/\" class=\"btn btn-primary\">Go Back Home</a>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "events/detail": function (locals, escapeFn, include, rethrow) {
var event = locals.event, user = locals.user, formatDate = locals.formatDate, formatTime = locals.formatTime;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( event.title ))
    ; __append(" - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  ")
    ;  const role = user ? String(user.role || '').toLowerCase() : ''; 
    ; __append("\r\n  ")
    ;  const canEditEvent = ['employee', 'management', 'admin'].includes(role); 
    ; __append("\r\n  ")
    ;  const canDeleteEvent = ['management', 'admin'].includes(role); 
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"place-detail\">\r\n      <div class=\"detail-header\">\r\n        <h1>")
    ; __append(escapeFn( event.title ))
    ; __append("</h1>\r\n        <span class=\"category-badge\">")
    ; __append(escapeFn( event.category ))
    ; __append("</span>\r\n      </div>\r\n\r\n      ")
    ;  if (event.tags) { 
    ; __append("\r\n        <div class=\"place-tags detail-tags\">\r\n          ")
    ;  event.tags.split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => { 
    ; __append("\r\n            <span class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</span>\r\n          ")
    ;  }) 
    ; __append("\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <div class=\"detail-info\">\r\n        <div class=\"info-section\">\r\n          <h3>Location</h3>\r\n          <p>")
    ; __append(escapeFn( event.location ))
    ; __append("</p>\r\n        </div>\r\n\r\n        <div class=\"info-section\">\r\n          <h3>Start</h3>\r\n          <p>")
    ;  if (event.start_at) { 
    ; __append("\r\n            ")
    ; __append(escapeFn( formatDate(event.start_at, { month: 'long', day: 'numeric', year: 'numeric' }) ))
    ; __append(" at ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n          ")
    ;  } 
    ; __append("</p>\r\n        </div>\r\n\r\n        ")
    ;  if (event.end_at) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>End</h3>\r\n            <p>")
    ; __append(escapeFn( formatTime(event.end_at) ))
    ; __append("</p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <div class=\"info-section\">\r\n          <h3>Capacity</h3>\r\n          <p>")
    ; __append(escapeFn( event.capacity ))
    ; __append(" guests</p>\r\n        </div>\r\n\r\n        <div class=\"info-section\">\r\n          <h3>Event Type</h3>\r\n          <p>")
    ; __append(escapeFn( (event.recurrence_type || 'one_time') === 'recurring' ? 'Recurring' : 'One-time' ))
    ; __append("</p>\r\n        </div>\r\n\r\n        ")
    ;  if (event.related_place_id && event.related_place_title) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>Linked Recommendation</h3>\r\n            <p>\r\n              ")
    ;  if ((event.related_place_relation || '').toLowerCase() === 'at') { 
    ; __append("\r\n                At\r\n              ")
    ;  } else if ((event.related_place_relation || '').toLowerCase() === 'by') { 
    ; __append("\r\n                By\r\n              ")
    ;  } else { 
    ; __append("\r\n                Connected to\r\n              ")
    ;  } 
    ; __append("\r\n              <a href=\"/places/")
    ; __append(escapeFn( event.related_place_id ))
    ; __append("\">")
    ; __append(escapeFn( event.related_place_title ))
    ; __append("</a>\r\n            </p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"detail-description\">\r\n        <h2>About</h2>\r\n        <p>")
    ; __append(escapeFn( event.description ))
    ; __append("</p>\r\n      </div>\r\n\r\n      <div class=\"place-actions\">\r\n        <a href=\"/events\" class=\"btn btn-secondary\">← Back to Events</a>\r\n        ")
    ;  if (canEditEvent) { 
    ; __append("\r\n          <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/edit\" class=\"btn btn-primary\">Edit</a>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (canEditEvent && event.is_active) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\" style=\"display:inline;\">\r\n            <button\r\n              type=\"button\"\r\n              class=\"btn btn-secondary js-archive-trigger\"\r\n              data-event-title=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\"\r\n              data-archive-action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\"\r\n            >Archive</button>\r\n          </form>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (canDeleteEvent && !event.is_active) { 
    ; __append("\r\n            <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/reactivate\" style=\"display:inline;\">\r\n              <button type=\"submit\" class=\"btn btn-primary\">Reactivate</button>\r\n            </form>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (canDeleteEvent) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/delete?_method=DELETE\" style=\"display:inline;\">\r\n            <button\r\n              type=\"button\"\r\n              class=\"btn btn-danger js-delete-trigger\"\r\n              data-event-title=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\"\r\n              data-delete-action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/delete?_method=DELETE\"\r\n            >Delete</button>\r\n          </form>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ;  if (canEditEvent && event.is_active) { 
    ; __append("\r\n    <div class=\"modal-backdrop\" id=\"archiveModal\" hidden>\r\n      <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"archiveModalTitle\">\r\n        <div class=\"modal-dialog-head\">\r\n          <h2 id=\"archiveModalTitle\">Archive Event</h2>\r\n          <button type=\"button\" class=\"modal-close\" id=\"archiveModalClose\" aria-label=\"Close archive dialog\">×</button>\r\n        </div>\r\n        <p class=\"modal-copy\" id=\"archiveModalCopy\">Move this event into inactive events?</p>\r\n        <p class=\"modal-copy modal-copy-soft\">Archived events are removed from the live events list and can be reactivated later from the admin inactive-events page.</p>\r\n        <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\" id=\"archiveModalForm\" class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"archiveModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-primary\">Archive Event</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  ")
    ;  if (canDeleteEvent) { 
    ; __append("\r\n    <div class=\"modal-backdrop\" id=\"deleteModal\" hidden>\r\n      <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"deleteModalTitle\">\r\n        <div class=\"modal-dialog-head\">\r\n          <h2 id=\"deleteModalTitle\">Delete Event</h2>\r\n          <button type=\"button\" class=\"modal-close\" id=\"deleteModalClose\" aria-label=\"Close delete dialog\">×</button>\r\n        </div>\r\n        <p class=\"modal-copy\" id=\"deleteModalCopy\">Delete this event permanently?</p>\r\n        <p class=\"modal-copy modal-copy-soft\">This action permanently removes the event. Use archive instead if you may need to restore it later.</p>\r\n        <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/delete?_method=DELETE\" id=\"deleteModalForm\" class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"deleteModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-danger\">Delete Event</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  ")
    ;  if (canEditEvent || canDeleteEvent) { 
    ; __append("\r\n    <script>\r\n    (function () {\r\n      const activeModals = [];\r\n\r\n      const setupModal = function (options) {\r\n        const modal = document.getElementById(options.modalId);\r\n        const modalForm = document.getElementById(options.formId);\r\n        const modalCopy = document.getElementById(options.copyId);\r\n        const closeButton = document.getElementById(options.closeId);\r\n        const cancelButton = document.getElementById(options.cancelId);\r\n        const trigger = document.querySelector(options.triggerSelector);\r\n\r\n        if (!modal || !modalForm || !modalCopy || !closeButton || !cancelButton || !trigger) {\r\n          return;\r\n        }\r\n\r\n        const closeModal = function () {\r\n          modal.hidden = true;\r\n          const modalIndex = activeModals.indexOf(closeModal);\r\n          if (modalIndex >= 0) {\r\n            activeModals.splice(modalIndex, 1);\r\n          }\r\n          if (!activeModals.length) {\r\n            document.body.classList.remove('modal-open');\r\n          }\r\n          trigger.focus();\r\n        };\r\n\r\n        trigger.addEventListener('click', function () {\r\n          modalForm.action = trigger.getAttribute(options.actionAttribute);\r\n          modalCopy.textContent = options.getCopy(trigger);\r\n          modal.hidden = false;\r\n          if (!activeModals.includes(closeModal)) {\r\n            activeModals.push(closeModal);\r\n          }\r\n          document.body.classList.add('modal-open');\r\n          closeButton.focus();\r\n        });\r\n\r\n        closeButton.addEventListener('click', closeModal);\r\n        cancelButton.addEventListener('click', closeModal);\r\n        modal.addEventListener('click', function (event) {\r\n          if (event.target === modal) {\r\n            closeModal();\r\n          }\r\n        });\r\n\r\n        return closeModal;\r\n      };\r\n\r\n      setupModal({\r\n        modalId: 'archiveModal',\r\n        formId: 'archiveModalForm',\r\n        copyId: 'archiveModalCopy',\r\n        closeId: 'archiveModalClose',\r\n        cancelId: 'archiveModalCancel',\r\n        triggerSelector: '.js-archive-trigger',\r\n        actionAttribute: 'data-archive-action',\r\n        getCopy: function (trigger) {\r\n          return 'Move \"' + trigger.getAttribute('data-event-title') + '\" into inactive events?';\r\n        }\r\n      });\r\n\r\n      setupModal({\r\n        modalId: 'deleteModal',\r\n        formId: 'deleteModalForm',\r\n        copyId: 'deleteModalCopy',\r\n        closeId: 'deleteModalClose',\r\n        cancelId: 'deleteModalCancel',\r\n        triggerSelector: '.js-delete-trigger',\r\n        actionAttribute: 'data-delete-action',\r\n        getCopy: function (trigger) {\r\n          return 'Delete \"' + trigger.getAttribute('data-event-title') + '\" permanently?';\r\n        }\r\n      });\r\n\r\n      document.addEventListener('keydown', function (event) {\r\n        if (event.key !== 'Escape') {\r\n          return;\r\n        }\r\n\r\n        const closeModal = activeModals[activeModals.length - 1];\r\n        if (closeModal) {\r\n          closeModal();\r\n        }\r\n      });\r\n    })();\r\n    </script>\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "events/edit": function (locals, escapeFn, include, rethrow) {
var message = locals.message, event = locals.event, placeOptions = locals.placeOptions, toDateInput = locals.toDateInput, toTimeInput = locals.toTimeInput;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Edit Event - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    <div class=\"form-container\">\r\n      <h1>Edit Event</h1>\r\n      \r\n      ")
    ;  if (typeof message !== 'undefined') { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  const eventData = event || {}; 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/update?_method=PUT\" id=\"event-form\">\r\n        <div class=\"form-group\">\r\n          <label for=\"title\">Event Title *</label>\r\n          <input type=\"text\" id=\"title\" name=\"title\" value=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"category\">Category *</label>\r\n          <select id=\"category\" name=\"category\" required>\r\n            <option value=\"Concert\" ")
    ;  if (event.category === 'Concert') { 
    ; __append("selected")
    ;  } 
    ; __append(">Concert</option>\r\n            <option value=\"Conference\" ")
    ;  if (event.category === 'Conference') { 
    ; __append("selected")
    ;  } 
    ; __append(">Conference</option>\r\n            <option value=\"Dinner\" ")
    ;  if (event.category === 'Dinner') { 
    ; __append("selected")
    ;  } 
    ; __append(">Dinner</option>\r\n            <option value=\"Workshop\" ")
    ;  if (event.category === 'Workshop') { 
    ; __append("selected")
    ;  } 
    ; __append(">Workshop</option>\r\n            <option value=\"Networking\" ")
    ;  if (event.category === 'Networking') { 
    ; __append("selected")
    ;  } 
    ; __append(">Networking</option>\r\n            <option value=\"Speakeasy\" ")
    ;  if (event.category === 'Speakeasy') { 
    ; __append("selected")
    ;  } 
    ; __append(">Speakeasy</option>\r\n            <option value=\"Other\" ")
    ;  if (event.category === 'Other') { 
    ; __append("selected")
    ;  } 
    ; __append(">Other</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"description\">Description *</label>\r\n          <textarea id=\"description\" name=\"description\" rows=\"6\" required>")
    ; __append(escapeFn( event.description ))
    ; __append("</textarea>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"location\">Location/Venue *</label>\r\n          <input type=\"text\" id=\"location\" name=\"location\" value=\"")
    ; __append(escapeFn( eventData.location ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"tags\">Event Tags</label>\r\n          <input type=\"text\" id=\"tags\" name=\"tags\" value=\"")
    ; __append(escapeFn( eventData.tags || '' ))
    ; __append("\" placeholder=\"music, rooftop, brunch, family-friendly\">\r\n          <small class=\"form-hint\">Comma-separated tags make events easier to discover.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"related_place_id\">Link To Recommendation</label>\r\n          <select id=\"related_place_id\" name=\"related_place_id\">\r\n            <option value=\"\">No linked recommendation</option>\r\n            ")
    ;  (placeOptions || []).forEach((placeOption) => { 
    ; __append("\r\n              <option value=\"")
    ; __append(escapeFn( placeOption.id ))
    ; __append("\" ")
    ; __append(escapeFn( String(eventData.related_place_id || '') === String(placeOption.id) ? 'selected' : '' ))
    ; __append(">\r\n                ")
    ; __append(escapeFn( placeOption.title ))
    ; __append(" (")
    ; __append(escapeFn( placeOption.location ))
    ; __append(")\r\n              </option>\r\n            ")
    ;  }) 
    ; __append("\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"related_place_relation\">Recommendation Relationship</label>\r\n          <select id=\"related_place_relation\" name=\"related_place_relation\">\r\n            <option value=\"\">Select relationship (optional)</option>\r\n            <option value=\"at\" ")
    ; __append(escapeFn( String(eventData.related_place_relation || '').toLowerCase() === 'at' ? 'selected' : '' ))
    ; __append(">At this recommendation location</option>\r\n            <option value=\"by\" ")
    ; __append(escapeFn( String(eventData.related_place_relation || '').toLowerCase() === 'by' ? 'selected' : '' ))
    ; __append(">By this recommendation (hosted/organized)</option>\r\n          </select>\r\n          <small class=\"form-hint\">Use this when the event happens at or is hosted by a listed recommendation.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"recurrence_type\">Event Type *</label>\r\n          <select id=\"recurrence_type\" name=\"recurrence_type\" required>\r\n            <option value=\"one_time\" ")
    ;  if ((event.recurrence_type || 'one_time') === 'one_time') { 
    ; __append("selected")
    ;  } 
    ; __append(">One-time (auto hide after next day)</option>\r\n            <option value=\"recurring\" ")
    ;  if (event.recurrence_type === 'recurring') { 
    ; __append("selected")
    ;  } 
    ; __append(">Recurring (stays listed permanently)</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div id=\"one-time-fields\" class=\"form-group\">\r\n          <label for=\"event_date\">Event Date *</label>\r\n          <input type=\"date\" id=\"event_date\" name=\"event_date\" value=\"")
    ; __append(escapeFn( toDateInput(event.start_at) ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div id=\"recurring-fields\" class=\"form-group\" style=\"display:none;\">\r\n          <label>Days of Week *</label>\r\n          ")
    ;  const recurringDays = (eventData.recurring_days || '').split(','); 
    ; __append("\r\n          <div class=\"weekday-grid\">\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"mon\" ")
    ; __append(escapeFn( recurringDays.includes('mon') ? 'checked' : '' ))
    ; __append("> Mon</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"tue\" ")
    ; __append(escapeFn( recurringDays.includes('tue') ? 'checked' : '' ))
    ; __append("> Tue</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"wed\" ")
    ; __append(escapeFn( recurringDays.includes('wed') ? 'checked' : '' ))
    ; __append("> Wed</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"thu\" ")
    ; __append(escapeFn( recurringDays.includes('thu') ? 'checked' : '' ))
    ; __append("> Thu</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"fri\" ")
    ; __append(escapeFn( recurringDays.includes('fri') ? 'checked' : '' ))
    ; __append("> Fri</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"sat\" ")
    ; __append(escapeFn( recurringDays.includes('sat') ? 'checked' : '' ))
    ; __append("> Sat</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"sun\" ")
    ; __append(escapeFn( recurringDays.includes('sun') ? 'checked' : '' ))
    ; __append("> Sun</label>\r\n          </div>\r\n          <small class=\"form-hint\">Select at least one day for recurring events.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"start_time\">Start Time *</label>\r\n          <input type=\"time\" id=\"start_time\" name=\"start_time\" value=\"")
    ; __append(escapeFn( toTimeInput(event.start_at) || '19:00' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"end_time\">End Time</label>\r\n          <input type=\"time\" id=\"end_time\" name=\"end_time\" value=\"")
    ; __append(escapeFn( toTimeInput(event.end_at) ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"capacity\">Capacity (number of guests) *</label>\r\n          <input type=\"number\" id=\"capacity\" name=\"capacity\" min=\"1\" value=\"")
    ; __append(escapeFn( event.capacity ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-actions\">\r\n          <button type=\"submit\" class=\"btn btn-primary\">Update Event</button>\r\n          <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-secondary\">Cancel</a>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </main>\r\n\r\n  <script>\r\n    const form = document.getElementById('event-form');\r\n    const recurrenceType = document.getElementById('recurrence_type');\r\n    const oneTimeFields = document.getElementById('one-time-fields');\r\n    const recurringFields = document.getElementById('recurring-fields');\r\n    const eventDate = document.getElementById('event_date');\r\n\r\n    function updateScheduleFields() {\r\n      const recurring = recurrenceType.value === 'recurring';\r\n      oneTimeFields.style.display = recurring ? 'none' : 'block';\r\n      recurringFields.style.display = recurring ? 'block' : 'none';\r\n      eventDate.required = !recurring;\r\n    }\r\n\r\n    recurrenceType.addEventListener('change', updateScheduleFields);\r\n    updateScheduleFields();\r\n\r\n    form.addEventListener('submit', function (event) {\r\n      if (recurrenceType.value !== 'recurring') {\r\n        return;\r\n      }\r\n\r\n      const checkedDays = document.querySelectorAll('input[name=\"recurring_days[]\"]:checked');\r\n      if (checkedDays.length < 1) {\r\n        event.preventDefault();\r\n        alert('Please select at least one day of the week for recurring events.');\r\n      }\r\n    });\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "events/inactive": function (locals, escapeFn, include, rethrow) {
var city = locals.city, user = locals.user, message = locals.message, events = locals.events;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Inactive Events - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container queue-page\">\r\n    <div class=\"queue-page-header\">\r\n      <div>\r\n        <h1>Inactive Events</h1>\r\n        <p class=\"queue-page-intro\">Review hidden or completed events for <strong>")
    ; __append(escapeFn( city ))
    ; __append("</strong>. Ended one-time events are moved here automatically, and admins can reactivate them for editing or delete them permanently.</p>\r\n      </div>\r\n      <div class=\"queue-card-actions\" style=\"margin-top: 0;\">\r\n        <a href=\"/admin\" class=\"btn btn-secondary\">Back to ")
    ; __append(escapeFn( user && user.role === 'management' ? 'Management Workspace' : 'Admin' ))
    ; __append("</a>\r\n        <a href=\"/events\" class=\"btn btn-primary\">View Active Events</a>\r\n      </div>\r\n    </div>\r\n\r\n    ")
    ;  if (message) { 
    ; __append("\r\n      <div class=\"alert alert-success\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  if (events && events.length > 0) { 
    ; __append("\r\n      <div class=\"queue-list\">\r\n        ")
    ;  events.forEach(event => { 
    ; __append("\r\n          <article class=\"queue-card\">\r\n            <div class=\"queue-card-head\">\r\n              <div>\r\n                <h2>")
    ; __append(escapeFn( event.title ))
    ; __append("</h2>\r\n                <div class=\"queue-card-meta\">\r\n                  <span><strong>Category:</strong> ")
    ; __append(escapeFn( event.category ))
    ; __append("</span>\r\n                  <span><strong>Location:</strong> ")
    ; __append(escapeFn( event.location ))
    ; __append("</span>\r\n                  <span><strong>Created by:</strong> ")
    ; __append(escapeFn( event.created_by_username || 'Unknown' ))
    ; __append("</span>\r\n                </div>\r\n              </div>\r\n              <div class=\"place-card-badges\">\r\n                <span class=\"badge-status ")
    ; __append(escapeFn( event.archived_reason === 'expired' ? 'badge-info' : 'badge-pending' ))
    ; __append("\">\r\n                  ")
    ; __append(escapeFn( event.archived_reason === 'expired' ? 'Completed Event' : 'Hidden Event' ))
    ; __append("\r\n                </span>\r\n                <span class=\"badge-status badge-city\">")
    ; __append(escapeFn( event.city ))
    ; __append("</span>\r\n              </div>\r\n            </div>\r\n\r\n            <p>")
    ; __append(escapeFn( event.description ))
    ; __append("</p>\r\n\r\n            <div class=\"queue-card-meta\">\r\n              <span><strong>Starts:</strong> ")
    ; __append(escapeFn( new Date(event.start_at).toLocaleString() ))
    ; __append("</span>\r\n              ")
    ;  if (event.end_at) { 
    ; __append("\r\n                <span><strong>Ends:</strong> ")
    ; __append(escapeFn( new Date(event.end_at).toLocaleString() ))
    ; __append("</span>\r\n              ")
    ;  } 
    ; __append("\r\n              <span><strong>Type:</strong> ")
    ; __append(escapeFn( (event.recurrence_type || 'one_time') === 'recurring' ? 'Recurring' : 'One-time' ))
    ; __append("</span>\r\n              ")
    ;  if (event.archived_at) { 
    ; __append("\r\n                <span><strong>Archived:</strong> ")
    ; __append(escapeFn( new Date(event.archived_at).toLocaleString() ))
    ; __append("</span>\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n\r\n            <div class=\"queue-card-actions\">\r\n              <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-secondary btn-sm\">View</a>\r\n              <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/reactivate\" class=\"queue-inline-form\">\r\n                <button type=\"submit\" class=\"btn btn-primary btn-sm\">Reactivate</button>\r\n              </form>\r\n            </div>\r\n          </article>\r\n        ")
    ;  }) 
    ; __append("\r\n      </div>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <div class=\"audit-empty-state\">\r\n        <strong>No inactive events for ")
    ; __append(escapeFn( city ))
    ; __append(".</strong>\r\n        <p>Hidden events and completed one-time events will appear here automatically.</p>\r\n      </div>\r\n    ")
    ;  } 
    ; __append("\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

},
  "events/index": function (locals, escapeFn, include, rethrow) {
var user = locals.user, sovaEvents = locals.sovaEvents, formatDate = locals.formatDate, formatTime = locals.formatTime, dallasEvents = locals.dallasEvents;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Events - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    <div class=\"events-page-header\">\r\n      <div>\r\n        <h1>SOVA Events</h1>\r\n        <p class=\"muted-text\">Browse SOVA-hosted events first, then explore the separate Dallas events section below.</p>\r\n      </div>\r\n    </div>\r\n\r\n    ")
    ;  if (user) { 
    ; __append("\r\n      <section class=\"workspace-card\" style=\"margin-bottom: 20px;\">\r\n        <h2>Create a New Event</h2>\r\n        <p>Add a one-time or recurring event directly from this page, or review events that have been hidden or automatically archived after they ended.</p>\r\n        <div class=\"queue-card-actions\" style=\"margin-top: 16px;\">\r\n          <a href=\"/events/new/form\" class=\"btn btn-primary\">+ Create Event</a>\r\n          <a href=\"/events/admin/inactive\" class=\"btn btn-secondary\">Inactive Events</a>\r\n        </div>\r\n      </section>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <section class=\"events-list-section\">\r\n      <div class=\"events-list-section-head\">\r\n        <div>\r\n          <h2>SOVA Events</h2>\r\n          <p class=\"muted-text\">Displaying only SOVA events in this section.</p>\r\n        </div>\r\n        <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( (sovaEvents || []).length ))
    ; __append(" live event")
    ; __append(escapeFn( (sovaEvents || []).length === 1 ? '' : 's' ))
    ; __append("</span>\r\n      </div>\r\n\r\n    ")
    ;  if (sovaEvents && sovaEvents.length > 0) { 
    ; __append("\r\n      <section class=\"events-list-section\">\r\n      <div class=\"events-showcase\">\r\n        ")
    ;  sovaEvents.forEach((event, index) => { 
    ; __append("\r\n          <div class=\"event-card ")
    ; __append(escapeFn( index === 0 ? 'event-featured' : '' ))
    ; __append("\">\r\n            <span class=\"event-tag\">")
    ; __append(escapeFn( event.category ))
    ; __append("</span>\r\n\r\n            ")
    ;  if (event.start_at) { 
    ; __append("\r\n              <div class=\"event-date\">\r\n                <span class=\"event-day\">")
    ; __append(escapeFn( formatDate(event.start_at, { weekday: 'short' }).toUpperCase() ))
    ; __append("</span>\r\n                <span class=\"event-num\">")
    ; __append(escapeFn( formatDate(event.start_at, { day: 'numeric' }) ))
    ; __append("</span>\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            <h3><a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" style=\"color:inherit;text-decoration:none;\">")
    ; __append(escapeFn( event.title ))
    ; __append("</a></h3>\r\n\r\n            ")
    ;  if (event.tags) { 
    ; __append("\r\n              <div class=\"place-tags\" style=\"margin-top: 0.35rem;\">\r\n                ")
    ;  event.tags.split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => { 
    ; __append("\r\n                  <span class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</span>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            ")
    ;  if (event.related_place_id && event.related_place_title) { 
    ; __append("\r\n              <p class=\"muted-text\" style=\"margin-top: 0.35rem;\">\r\n                🔗 ")
    ;  if ((event.related_place_relation || '').toLowerCase() === 'at') { 
    ; __append("At")
    ;  } else if ((event.related_place_relation || '').toLowerCase() === 'by') { 
    ; __append("By")
    ;  } else { 
    ; __append("Linked to")
    ;  } 
    ; __append("\r\n                <a href=\"/places/")
    ; __append(escapeFn( event.related_place_id ))
    ; __append("\">")
    ; __append(escapeFn( event.related_place_title ))
    ; __append("</a>\r\n              </p>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            <p>📍 ")
    ; __append(escapeFn( event.location ))
    ; __append("</p>\r\n            ")
    ;  if (event.start_at) { 
    ; __append("\r\n              <p>🕐 ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                ")
    ;  if (event.end_at) { 
    ; __append(" – ")
    ; __append(escapeFn( formatTime(event.end_at) ))
    ;  } 
    ; __append("\r\n              </p>\r\n            ")
    ;  } 
    ; __append("\r\n            <p>🔁 ")
    ; __append(escapeFn( (event.recurrence_type || 'one_time') === 'recurring' ? 'Recurring Event' : 'One-time Event' ))
    ; __append("</p>\r\n            <p>👥 Up to ")
    ; __append(escapeFn( event.capacity ))
    ; __append(" guests</p>\r\n\r\n            <p>")
    ; __append(escapeFn( event.description.substring(0, 90) ))
    ; __append("...</p>\r\n\r\n            <div class=\"place-actions\" style=\"margin-top:16px;\">\r\n              <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-primary btn-sm\">View Details</a>\r\n              ")
    ;  if (user && ['employee', 'management', 'admin'].includes(String(user.role || '').toLowerCase())) { 
    ; __append("\r\n                <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\" style=\"display:inline;\">\r\n                  <button\r\n                    type=\"button\"\r\n                    class=\"btn btn-secondary btn-sm js-archive-trigger\"\r\n                    data-event-title=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\"\r\n                    data-archive-action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\"\r\n                  >Archive</button>\r\n                </form>\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n          </div>\r\n        ")
    ;  }); 
    ; __append("\r\n      </div>\r\n      </section>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <div class=\"empty-state\">\r\n        <p>No SOVA events scheduled right now.\r\n          ")
    ;  if (user) { 
    ; __append("\r\n            <a href=\"/events/new/form\">Create the first event!</a>\r\n          ")
    ;  } 
    ; __append("\r\n        </p>\r\n      </div>\r\n    ")
    ;  } 
    ; __append("\r\n    </section>\r\n\r\n    <section class=\"events-list-section\">\r\n      <div class=\"events-list-section-head\">\r\n        <div>\r\n          <h2>Dallas Events</h2>\r\n          <p class=\"muted-text\">Current events and recurring favorites happening in <strong>Dallas</strong>.</p>\r\n        </div>\r\n        <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( (dallasEvents || []).length ))
    ; __append(" live event")
    ; __append(escapeFn( (dallasEvents || []).length === 1 ? '' : 's' ))
    ; __append("</span>\r\n      </div>\r\n\r\n    ")
    ;  if (dallasEvents && dallasEvents.length > 0) { 
    ; __append("\r\n      <div class=\"events-showcase\">\r\n        ")
    ;  dallasEvents.forEach((event, index) => { 
    ; __append("\r\n          <div class=\"event-card ")
    ; __append(escapeFn( index === 0 ? 'event-featured' : '' ))
    ; __append("\">\r\n            <span class=\"event-tag\">")
    ; __append(escapeFn( event.category ))
    ; __append("</span>\r\n\r\n            ")
    ;  if (event.start_at) { 
    ; __append("\r\n              <div class=\"event-date\">\r\n                <span class=\"event-day\">")
    ; __append(escapeFn( formatDate(event.start_at, { weekday: 'short' }).toUpperCase() ))
    ; __append("</span>\r\n                <span class=\"event-num\">")
    ; __append(escapeFn( formatDate(event.start_at, { day: 'numeric' }) ))
    ; __append("</span>\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            <h3><a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" style=\"color:inherit;text-decoration:none;\">")
    ; __append(escapeFn( event.title ))
    ; __append("</a></h3>\r\n\r\n            ")
    ;  if (event.tags) { 
    ; __append("\r\n              <div class=\"place-tags\" style=\"margin-top: 0.35rem;\">\r\n                ")
    ;  event.tags.split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => { 
    ; __append("\r\n                  <span class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</span>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            ")
    ;  if (event.related_place_id && event.related_place_title) { 
    ; __append("\r\n              <p class=\"muted-text\" style=\"margin-top: 0.35rem;\">\r\n                🔗 ")
    ;  if ((event.related_place_relation || '').toLowerCase() === 'at') { 
    ; __append("At")
    ;  } else if ((event.related_place_relation || '').toLowerCase() === 'by') { 
    ; __append("By")
    ;  } else { 
    ; __append("Linked to")
    ;  } 
    ; __append("\r\n                <a href=\"/places/")
    ; __append(escapeFn( event.related_place_id ))
    ; __append("\">")
    ; __append(escapeFn( event.related_place_title ))
    ; __append("</a>\r\n              </p>\r\n            ")
    ;  } 
    ; __append("\r\n\r\n            <p>📍 ")
    ; __append(escapeFn( event.location ))
    ; __append("</p>\r\n            ")
    ;  if (event.start_at) { 
    ; __append("\r\n              <p>🕐 ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                ")
    ;  if (event.end_at) { 
    ; __append(" – ")
    ; __append(escapeFn( formatTime(event.end_at) ))
    ;  } 
    ; __append("\r\n              </p>\r\n            ")
    ;  } 
    ; __append("\r\n            <p>🔁 ")
    ; __append(escapeFn( (event.recurrence_type || 'one_time') === 'recurring' ? 'Recurring Event' : 'One-time Event' ))
    ; __append("</p>\r\n            <p>👥 Up to ")
    ; __append(escapeFn( event.capacity ))
    ; __append(" guests</p>\r\n\r\n            <p>")
    ; __append(escapeFn( event.description.substring(0, 90) ))
    ; __append("...</p>\r\n\r\n            <div class=\"place-actions\" style=\"margin-top:16px;\">\r\n              <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-primary btn-sm\">View Details</a>\r\n              ")
    ;  if (user && ['employee', 'management', 'admin'].includes(String(user.role || '').toLowerCase())) { 
    ; __append("\r\n                <form method=\"POST\" action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\" style=\"display:inline;\">\r\n                  <button\r\n                    type=\"button\"\r\n                    class=\"btn btn-secondary btn-sm js-archive-trigger\"\r\n                    data-event-title=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\"\r\n                    data-archive-action=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("/archive\"\r\n                  >Archive</button>\r\n                </form>\r\n              ")
    ;  } 
    ; __append("\r\n            </div>\r\n          </div>\r\n        ")
    ;  }); 
    ; __append("\r\n      </div>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <div class=\"empty-state\">\r\n        <p>No Dallas events available right now.</p>\r\n      </div>\r\n    ")
    ;  } 
    ; __append("\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ;  if (user) { 
    ; __append("\r\n    <div class=\"modal-backdrop\" id=\"archiveModal\" hidden>\r\n      <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"archiveModalTitle\">\r\n        <div class=\"modal-dialog-head\">\r\n          <h2 id=\"archiveModalTitle\">Archive Event</h2>\r\n          <button type=\"button\" class=\"modal-close\" id=\"archiveModalClose\" aria-label=\"Close archive dialog\">×</button>\r\n        </div>\r\n        <p class=\"modal-copy\" id=\"archiveModalCopy\">Move this event into inactive events?</p>\r\n        <p class=\"modal-copy modal-copy-soft\">Archived events are removed from the live events list and can be reactivated later from the admin inactive-events page.</p>\r\n        <form method=\"POST\" action=\"/events/0/archive\" id=\"archiveModalForm\" class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"archiveModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-primary\">Archive Event</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n\r\n    <script>\r\n    (function () {\r\n      const activeModals = [];\r\n\r\n      const setupModal = function (options) {\r\n        const modal = document.getElementById(options.modalId);\r\n        const modalForm = document.getElementById(options.formId);\r\n        const modalCopy = document.getElementById(options.copyId);\r\n        const closeButton = document.getElementById(options.closeId);\r\n        const cancelButton = document.getElementById(options.cancelId);\r\n        const triggers = document.querySelectorAll(options.triggerSelector);\r\n\r\n        if (!modal || !modalForm || !modalCopy || !closeButton || !cancelButton || !triggers.length) {\r\n          return;\r\n        }\r\n\r\n        let lastTrigger = null;\r\n\r\n        const closeModal = function () {\r\n          modal.hidden = true;\r\n          const modalIndex = activeModals.indexOf(closeModal);\r\n          if (modalIndex >= 0) {\r\n            activeModals.splice(modalIndex, 1);\r\n          }\r\n          if (!activeModals.length) {\r\n            document.body.classList.remove('modal-open');\r\n          }\r\n          if (lastTrigger) {\r\n            lastTrigger.focus();\r\n          }\r\n        };\r\n\r\n        triggers.forEach(function (trigger) {\r\n          trigger.addEventListener('click', function () {\r\n            lastTrigger = trigger;\r\n            modalForm.action = trigger.getAttribute(options.actionAttribute);\r\n            modalCopy.textContent = options.getCopy(trigger);\r\n            modal.hidden = false;\r\n            if (!activeModals.includes(closeModal)) {\r\n              activeModals.push(closeModal);\r\n            }\r\n            document.body.classList.add('modal-open');\r\n            closeButton.focus();\r\n          });\r\n        });\r\n\r\n        closeButton.addEventListener('click', closeModal);\r\n        cancelButton.addEventListener('click', closeModal);\r\n        modal.addEventListener('click', function (event) {\r\n          if (event.target === modal) {\r\n            closeModal();\r\n          }\r\n        });\r\n\r\n        return closeModal;\r\n      };\r\n\r\n      const closeArchiveModal = setupModal({\r\n        modalId: 'archiveModal',\r\n        formId: 'archiveModalForm',\r\n        copyId: 'archiveModalCopy',\r\n        closeId: 'archiveModalClose',\r\n        cancelId: 'archiveModalCancel',\r\n        triggerSelector: '.js-archive-trigger',\r\n        actionAttribute: 'data-archive-action',\r\n        getCopy: function (trigger) {\r\n          return 'Move \"' + trigger.getAttribute('data-event-title') + '\" into inactive events?';\r\n        }\r\n      });\r\n\r\n      document.addEventListener('keydown', function (event) {\r\n        if (event.key !== 'Escape') {\r\n          return;\r\n        }\r\n\r\n        const closeModal = activeModals[activeModals.length - 1];\r\n        if (closeModal) {\r\n          closeModal();\r\n        }\r\n      });\r\n    })();\r\n    </script>\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "events/new": function (locals, escapeFn, include, rethrow) {
var message = locals.message, formData = locals.formData, placeOptions = locals.placeOptions;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Add New Event - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    <div class=\"form-container\">\r\n      <h1>Add New Event</h1>\r\n      \r\n      ")
    ;  if (typeof message !== 'undefined') { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  const eventData = formData || {}; 
    ; __append("\r\n      <form method=\"POST\" action=\"/events/new/create\" id=\"event-form\">\r\n        <div class=\"form-group\">\r\n          <label for=\"title\">Event Title *</label>\r\n          <input type=\"text\" id=\"title\" name=\"title\" value=\"")
    ; __append(escapeFn( eventData.title || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"category\">Category *</label>\r\n          <select id=\"category\" name=\"category\" required>\r\n            <option value=\"\">Select a category</option>\r\n            <option value=\"Concert\" ")
    ; __append(escapeFn( eventData.category === 'Concert' ? 'selected' : '' ))
    ; __append(">Concert</option>\r\n            <option value=\"Conference\" ")
    ; __append(escapeFn( eventData.category === 'Conference' ? 'selected' : '' ))
    ; __append(">Conference</option>\r\n            <option value=\"Dinner\" ")
    ; __append(escapeFn( eventData.category === 'Dinner' ? 'selected' : '' ))
    ; __append(">Dinner</option>\r\n            <option value=\"Workshop\" ")
    ; __append(escapeFn( eventData.category === 'Workshop' ? 'selected' : '' ))
    ; __append(">Workshop</option>\r\n            <option value=\"Networking\" ")
    ; __append(escapeFn( eventData.category === 'Networking' ? 'selected' : '' ))
    ; __append(">Networking</option>\r\n            <option value=\"Speakeasy\" ")
    ; __append(escapeFn( eventData.category === 'Speakeasy' ? 'selected' : '' ))
    ; __append(">Speakeasy</option>\r\n            <option value=\"Other\" ")
    ; __append(escapeFn( eventData.category === 'Other' ? 'selected' : '' ))
    ; __append(">Other</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"description\">Description *</label>\r\n          <textarea id=\"description\" name=\"description\" rows=\"6\" required>")
    ; __append(escapeFn( eventData.description || '' ))
    ; __append("</textarea>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"location\">Location/Venue *</label>\r\n          <input type=\"text\" id=\"location\" name=\"location\" value=\"")
    ; __append(escapeFn( eventData.location || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"tags\">Event Tags</label>\r\n          <input type=\"text\" id=\"tags\" name=\"tags\" value=\"")
    ; __append(escapeFn( eventData.tags || '' ))
    ; __append("\" placeholder=\"music, rooftop, brunch, family-friendly\">\r\n          <small class=\"form-hint\">Comma-separated tags make events easier to discover.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"related_place_id\">Link To Recommendation</label>\r\n          <select id=\"related_place_id\" name=\"related_place_id\">\r\n            <option value=\"\">No linked recommendation</option>\r\n            ")
    ;  (placeOptions || []).forEach((placeOption) => { 
    ; __append("\r\n              <option value=\"")
    ; __append(escapeFn( placeOption.id ))
    ; __append("\" ")
    ; __append(escapeFn( String(eventData.related_place_id || '') === String(placeOption.id) ? 'selected' : '' ))
    ; __append(">\r\n                ")
    ; __append(escapeFn( placeOption.title ))
    ; __append(" (")
    ; __append(escapeFn( placeOption.location ))
    ; __append(")\r\n              </option>\r\n            ")
    ;  }) 
    ; __append("\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"related_place_relation\">Recommendation Relationship</label>\r\n          <select id=\"related_place_relation\" name=\"related_place_relation\">\r\n            <option value=\"\">Select relationship (optional)</option>\r\n            <option value=\"at\" ")
    ; __append(escapeFn( String(eventData.related_place_relation || '').toLowerCase() === 'at' ? 'selected' : '' ))
    ; __append(">At this recommendation location</option>\r\n            <option value=\"by\" ")
    ; __append(escapeFn( String(eventData.related_place_relation || '').toLowerCase() === 'by' ? 'selected' : '' ))
    ; __append(">By this recommendation (hosted/organized)</option>\r\n          </select>\r\n          <small class=\"form-hint\">Use this when the event happens at or is hosted by a listed recommendation.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"recurrence_type\">Event Type *</label>\r\n          <select id=\"recurrence_type\" name=\"recurrence_type\" required>\r\n            <option value=\"one_time\" ")
    ; __append(escapeFn( (eventData.recurrence_type || 'one_time') === 'one_time' ? 'selected' : '' ))
    ; __append(">One-time (auto hide after next day)</option>\r\n            <option value=\"recurring\" ")
    ; __append(escapeFn( eventData.recurrence_type === 'recurring' ? 'selected' : '' ))
    ; __append(">Recurring (stays listed permanently)</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div id=\"one-time-fields\" class=\"form-group\">\r\n          <label for=\"event_date\">Event Date *</label>\r\n          <input type=\"date\" id=\"event_date\" name=\"event_date\" value=\"")
    ; __append(escapeFn( eventData.event_date || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div id=\"recurring-fields\" class=\"form-group\" style=\"display:none;\">\r\n          <label>Days of Week *</label>\r\n          <div class=\"weekday-grid\">\r\n            ")
    ;  const selectedRecurringDays = Array.isArray(eventData['recurring_days[]']) ? eventData['recurring_days[]'] : (eventData.recurring_days ? String(eventData.recurring_days).split(',') : []); 
    ; __append("\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"mon\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('mon') ? 'checked' : '' ))
    ; __append("> Mon</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"tue\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('tue') ? 'checked' : '' ))
    ; __append("> Tue</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"wed\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('wed') ? 'checked' : '' ))
    ; __append("> Wed</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"thu\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('thu') ? 'checked' : '' ))
    ; __append("> Thu</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"fri\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('fri') ? 'checked' : '' ))
    ; __append("> Fri</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"sat\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('sat') ? 'checked' : '' ))
    ; __append("> Sat</label>\r\n            <label><input type=\"checkbox\" name=\"recurring_days[]\" value=\"sun\" ")
    ; __append(escapeFn( selectedRecurringDays.includes('sun') ? 'checked' : '' ))
    ; __append("> Sun</label>\r\n          </div>\r\n          <small class=\"form-hint\">Select at least one day for recurring events.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"start_time\">Start Time *</label>\r\n          <input type=\"time\" id=\"start_time\" name=\"start_time\" value=\"")
    ; __append(escapeFn( eventData.start_time || '19:00' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"end_time\">End Time</label>\r\n          <input type=\"time\" id=\"end_time\" name=\"end_time\" value=\"")
    ; __append(escapeFn( eventData.end_time || '' ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"capacity\">Capacity (number of guests) *</label>\r\n          <input type=\"number\" id=\"capacity\" name=\"capacity\" min=\"1\" value=\"")
    ; __append(escapeFn( eventData.capacity || '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-actions\">\r\n          <button type=\"submit\" class=\"btn btn-primary\">Create Event</button>\r\n          <a href=\"/events\" class=\"btn btn-secondary\">Cancel</a>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </main>\r\n\r\n  <script>\r\n    const form = document.getElementById('event-form');\r\n    const recurrenceType = document.getElementById('recurrence_type');\r\n    const oneTimeFields = document.getElementById('one-time-fields');\r\n    const recurringFields = document.getElementById('recurring-fields');\r\n    const eventDate = document.getElementById('event_date');\r\n\r\n    function updateScheduleFields() {\r\n      const recurring = recurrenceType.value === 'recurring';\r\n      oneTimeFields.style.display = recurring ? 'none' : 'block';\r\n      recurringFields.style.display = recurring ? 'block' : 'none';\r\n      eventDate.required = !recurring;\r\n    }\r\n\r\n    recurrenceType.addEventListener('change', updateScheduleFields);\r\n    updateScheduleFields();\r\n\r\n    form.addEventListener('submit', function (event) {\r\n      if (recurrenceType.value !== 'recurring') {\r\n        return;\r\n      }\r\n\r\n      const checkedDays = document.querySelectorAll('input[name=\"recurring_days[]\"]:checked');\r\n      if (checkedDays.length < 1) {\r\n        event.preventDefault();\r\n        alert('Please select at least one day of the week for recurring events.');\r\n      }\r\n    });\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "faq": function (locals, escapeFn, include, rethrow) {
var faqContent = locals.faqContent;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>FAQ - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('./partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"content-page support-page\">\r\n      <div class=\"support-hero\">\r\n        <div>\r\n          <p class=\"support-eyebrow\">")
    ; __append(escapeFn( faqContent.audienceLabel ))
    ; __append("</p>\r\n          <h1>")
    ; __append(escapeFn( faqContent.title ))
    ; __append("</h1>\r\n          <p>")
    ; __append(escapeFn( faqContent.description ))
    ; __append("</p>\r\n        </div>\r\n        <div class=\"support-quick-links\">\r\n          <a class=\"support-chip\" href=\"/support\">Support Home</a>\r\n          <a class=\"support-chip\" href=\"/support/contact\">Contact</a>\r\n          <a class=\"support-chip\" href=\"/support/suggestions\">Suggestion Box</a>\r\n        </div>\r\n      </div>\r\n\r\n      <section class=\"support-section\">\r\n        <div class=\"support-faq-list\">\r\n          ")
    ;  faqContent.items.forEach((item, index) => { 
    ; __append("\r\n            <details class=\"support-faq-item\" ")
    ; __append(escapeFn( index === 0 ? 'open' : '' ))
    ; __append(">\r\n              <summary class=\"support-faq-question\">")
    ; __append(escapeFn( item.question ))
    ; __append("</summary>\r\n              <div class=\"support-faq-answer\">\r\n                <p>")
    ; __append(escapeFn( item.answer ))
    ; __append("</p>\r\n              </div>\r\n            </details>\r\n          ")
    ;  }) 
    ; __append("\r\n        </div>\r\n      </section>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('./partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "index": function (locals, escapeFn, include, rethrow) {
var maintenanceMode = locals.maintenanceMode, databaseError = locals.databaseError, city = locals.city, user = locals.user, sovaEvents = locals.sovaEvents, formatDate = locals.formatDate, formatTime = locals.formatTime, cityEvents = locals.cityEvents;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>SOVA Scoop - Personalized City Recommendations</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('./partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    ")
    ;  if (maintenanceMode) { 
    ; __append("\r\n      <div style=\"background-color: #fff3cd; border-bottom: 2px solid #ffc107; padding: 16px; text-align: center; margin-bottom: 20px;\">\r\n        <p style=\"margin: 0; color: #333;\">\r\n          <strong>⚠️ Maintenance Mode:</strong> The website is currently running with limited functionality. \r\n          ")
    ;  if (databaseError) { 
    ; __append("\r\n            Database connection issue: ")
    ; __append(escapeFn( databaseError ))
    ; __append("\r\n          ")
    ;  } 
    ; __append("\r\n          Please ensure XAMPP MySQL service is running.\r\n        </p>\r\n      </div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <!-- Hero Section -->\r\n    <section class=\"hero-section\">\r\n      <div class=\"hero-overlay\"></div>\r\n      <div class=\"hero-content\">\r\n        <h1>Discover ")
    ; __append(escapeFn( city ))
    ; __append(" Like a Local</h1>\r\n        <p>Personalized recommendations for the best dining, entertainment, and experiences in ")
    ; __append(escapeFn( city ))
    ; __append("</p>\r\n      </div>\r\n    </section>\r\n\r\n    ")
    ;  if (!user) { 
    ; __append("\r\n      <section class=\"container\" style=\"margin-top: 18px; margin-bottom: 4px;\">\r\n        <div class=\"workspace-card\" style=\"display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;\">\r\n          <div>\r\n            <h2 style=\"margin-bottom: 6px;\">Guest Features In Progress</h2>\r\n            <p style=\"margin-bottom: 0;\">A few guest tools are still being built. Tap below to preview what's next.</p>\r\n          </div>\r\n          <div class=\"coming-soon-actions\">\r\n            <a href=\"#\" class=\"btn btn-secondary\" data-coming-soon=\"Saved itineraries are in progress and will let guests keep trip plans across sessions.\" data-coming-soon-title=\"Saved Itineraries Coming Soon\">Saved Itineraries</a>\r\n            <a href=\"#\" class=\"btn btn-secondary\" data-coming-soon=\"The guest rewards dashboard is still under development. You will be able to track perks and benefits here.\" data-coming-soon-title=\"Guest Rewards Coming Soon\">Guest Rewards</a>\r\n          </div>\r\n        </div>\r\n      </section>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <!-- Services Section -->\r\n    <section class=\"services\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header\">\r\n          <h2>Our Concierge Services</h2>\r\n          <p>Curated experiences tailored to your preferences</p>\r\n        </div>\r\n        <div class=\"services-grid\">\r\n          <a href=\"/services/fine-dining\" class=\"service-card\">\r\n            <div class=\"service-icon\">🍽️</div>\r\n            <h3>Fine Dining & Cuisine</h3>\r\n            <p>Explore world-class restaurants and culinary experiences from every corner of the city</p>\r\n          </a>\r\n          <a href=\"/services/bars-entertainment\" class=\"service-card\">\r\n            <div class=\"service-icon\">🍷</div>\r\n            <h3>Bars & Entertainment</h3>\r\n            <p>Discover cocktail bars, lounges, and exclusive venues for an unforgettable night out</p>\r\n          </a>\r\n          <a href=\"/services/culture-events\" class=\"service-card\">\r\n            <div class=\"service-icon\">🎭</div>\r\n            <h3>Culture & Events</h3>\r\n            <p>Find museums, theaters, galleries, and attractions that define the city's character</p>\r\n          </a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- How It Works Section -->\r\n    <section class=\"how-it-works\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header\">\r\n          <h2>How It Works</h2>\r\n          <p>Simple steps to find your next favorite place</p>\r\n        </div>\r\n        <div class=\"steps-grid\">\r\n          <a href=\"/places\" class=\"step\">\r\n            <div class=\"step-number\">1</div>\r\n            <h3>Browse Recommendations</h3>\r\n            <p>Explore our curated collection of restaurants, bars, and attractions</p>\r\n          </a>\r\n          <div class=\"step\">\r\n            <div class=\"step-number\">2</div>\r\n            <h3>Filter by Interest</h3>\r\n            <p>Find exactly what you're looking for with our powerful search and filters</p>\r\n          </div>\r\n          <div class=\"step\">\r\n            <div class=\"step-number\">3</div>\r\n            <h3>Share & Create</h3>\r\n            <p>Register to add your own recommendations and share favorites with others</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- Travel Guide Recommendations Section -->\r\n    <section class=\"travel-guide\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header\">\r\n          <h2>Travel Guide Recommendations</h2>\r\n          <p>Expert curated guides for unforgettable experiences</p>\r\n        </div>\r\n        <div class=\"travel-grid\">\r\n          <a href=\"/travel/city-highlights\" class=\"travel-card\">\r\n            <div class=\"travel-icon\">✈️</div>\r\n            <h3>City Highlights</h3>\r\n            <p>Essential destinations no visitor should miss - iconic landmarks and must-see attractions</p>\r\n          </a>\r\n          <a href=\"/travel/neighborhood-guides\" class=\"travel-card\">\r\n            <div class=\"travel-icon\">🗺️</div>\r\n            <h3>Neighborhood Guides</h3>\r\n            <p>Explore distinct neighborhoods with insider knowledge and local recommendations</p>\r\n          </a>\r\n          <a href=\"/travel/day-trips\" class=\"travel-card\">\r\n            <div class=\"travel-icon\">🎒</div>\r\n            <h3>Day Trip Ideas</h3>\r\n            <p>Discover nearby destinations perfect for day trips and weekend getaways</p>\r\n          </a>\r\n          <a href=\"/travel/walking-tours\" class=\"travel-card\">\r\n            <div class=\"travel-icon\">🚶</div>\r\n            <h3>Walking Tours</h3>\r\n            <p>Self-guided and curated walking routes through the city's most beautiful areas</p>\r\n          </a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- SOVA Events Section -->\r\n    <section class=\"sova-events\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header\">\r\n          <h2>SOVA Events</h2>\r\n          <p>Stay updated on the current SOVA events available in ")
    ; __append(escapeFn( city ))
    ; __append("</p>\r\n        </div>\r\n        ")
    ;  if (sovaEvents && sovaEvents.length) { 
    ; __append("\r\n          <div class=\"events-showcase\">\r\n            ")
    ;  sovaEvents.forEach((event, index) => { 
    ; __append("\r\n              <article class=\"event-card ")
    ; __append(escapeFn( index === 0 ? 'event-featured' : '' ))
    ; __append("\">\r\n                ")
    ;  if (index === 0) { 
    ; __append("\r\n                  <div class=\"event-tag\">Current</div>\r\n                ")
    ;  } 
    ; __append("\r\n                <div class=\"event-date\">\r\n                  <span class=\"event-day\">")
    ; __append(escapeFn( formatDate(event.start_at, { month: 'short' }) ))
    ; __append("</span>\r\n                  <span class=\"event-num\">")
    ; __append(escapeFn( formatDate(event.start_at, { day: '2-digit' }) ))
    ; __append("</span>\r\n                </div>\r\n                <h3>")
    ; __append(escapeFn( event.title ))
    ; __append("</h3>\r\n                <p>")
    ; __append(escapeFn( event.description ))
    ; __append("</p>\r\n                <p class=\"muted-text\">\r\n                  <strong>")
    ; __append(escapeFn( event.location ))
    ; __append("</strong>\r\n                  ")
    ;  if (event.recurrence_type === 'recurring' && event.recurring_days) { 
    ; __append("\r\n                    • Repeats ")
    ; __append(escapeFn( event.recurring_days.toUpperCase().split(',').join(', ') ))
    ; __append("\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    • ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                  ")
    ;  } 
    ; __append("\r\n                </p>\r\n                <div class=\"place-actions\" style=\"margin-top:16px;\">\r\n                  <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-primary btn-sm\">View Event</a>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"event-card event-featured\">\r\n            <h3>No current events</h3>\r\n            <p>There are no live SOVA events scheduled in ")
    ; __append(escapeFn( city ))
    ; __append(" right now. Check back soon for new programming.</p>\r\n            <a href=\"/events\" class=\"btn btn-primary btn-sm\">Browse Events</a>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"sova-events\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header\">\r\n          <h2>")
    ; __append(escapeFn( city ))
    ; __append(" Events</h2>\r\n          <p>Explore city events separately from SOVA-hosted programming.</p>\r\n        </div>\r\n        ")
    ;  if (cityEvents && cityEvents.length) { 
    ; __append("\r\n          <div class=\"events-showcase\">\r\n            ")
    ;  cityEvents.forEach((event, index) => { 
    ; __append("\r\n              <article class=\"event-card ")
    ; __append(escapeFn( index === 0 ? 'event-featured' : '' ))
    ; __append("\">\r\n                <div class=\"event-date\">\r\n                  <span class=\"event-day\">")
    ; __append(escapeFn( formatDate(event.start_at, { month: 'short' }) ))
    ; __append("</span>\r\n                  <span class=\"event-num\">")
    ; __append(escapeFn( formatDate(event.start_at, { day: '2-digit' }) ))
    ; __append("</span>\r\n                </div>\r\n                <h3>")
    ; __append(escapeFn( event.title ))
    ; __append("</h3>\r\n                <p>")
    ; __append(escapeFn( event.description ))
    ; __append("</p>\r\n                <p class=\"muted-text\">\r\n                  <strong>")
    ; __append(escapeFn( event.location ))
    ; __append("</strong>\r\n                  ")
    ;  if (event.recurrence_type === 'recurring' && event.recurring_days) { 
    ; __append("\r\n                    • Repeats ")
    ; __append(escapeFn( event.recurring_days.toUpperCase().split(',').join(', ') ))
    ; __append("\r\n                  ")
    ;  } else { 
    ; __append("\r\n                    • ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                  ")
    ;  } 
    ; __append("\r\n                </p>\r\n                <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-primary btn-sm\">View Event</a>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"event-card event-featured\">\r\n            <h3>No current city events</h3>\r\n            <p>There are no additional city events scheduled in ")
    ; __append(escapeFn( city ))
    ; __append(" right now.</p>\r\n            <a href=\"/events\" class=\"btn btn-primary btn-sm\">Browse Events</a>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </section>\r\n\r\n    <!-- CTA Section -->\r\n    <section class=\"cta-section\">\r\n      <div class=\"container\">\r\n        <h2>Ready to Explore?</h2>\r\n        <p>Start discovering the best places in the city</p>\r\n      </div>\r\n    </section>\r\n  </main>\r\n\r\n  ")
    ; __append( include('./partials/footer') )
    ; __append("\r\n  ")
    ; __append( include('./partials/coming-soon-modal') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "layout": function (locals, escapeFn, include, rethrow) {
var body = locals.body;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Hotel Concierge - Recommendations</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    ")
    ; __append( body )
    ; __append("\r\n  </main>\r\n\r\n  ")
    ; __append( include('partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "partials/adventure-guide-quiz-modal": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<div class=\"guide-quiz-overlay\" id=\"guideQuizOverlay\" hidden aria-modal=\"true\" role=\"dialog\" aria-labelledby=\"quizModalTitle\">\r\n  <div class=\"guide-quiz-modal\">\r\n    <button type=\"button\" class=\"guide-quiz-close\" id=\"guideQuizClose\" aria-label=\"Close quiz\">&times;</button>\r\n    <h2 id=\"quizModalTitle\">Build Your Adventure</h2>\r\n    <p class=\"muted-text\">Answer a few quick questions and we'll build a personalised itinerary for your guest.</p>\r\n\r\n    <form id=\"guideQuizForm\" novalidate>\r\n\r\n      <!-- Q1: Vibe -->\r\n      <div class=\"quiz-question\" data-question=\"1\">\r\n        <p class=\"quiz-q-label\">1. What's the vibe?</p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"lively\"> &#127881; Lively &amp; Fun</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"chill\"> &#9749; Chill &amp; Relaxed</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"romantic\"> &#10084;&#65039; Romantic</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"adventure\"> &#127939; Active / Adventure</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"foodie\"> &#127829; Foodie Tour</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"vibe\" value=\"cultural\"> &#127981; Arts &amp; Culture</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q2: Time of day -->\r\n      <div class=\"quiz-question\" data-question=\"2\">\r\n        <p class=\"quiz-q-label\">2. What time of day?</p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"time_of_day\" value=\"morning\"> &#9728;&#65039; Morning</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"time_of_day\" value=\"afternoon\"> &#127767; Afternoon</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"time_of_day\" value=\"evening\"> &#127768; Evening / Night</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"time_of_day\" value=\"flexible\"> &#128344; Flexible / All Day</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q3: Group -->\r\n      <div class=\"quiz-question\" data-question=\"3\">\r\n        <p class=\"quiz-q-label\">3. Who's the guest with?</p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"solo\"> &#129331; Solo traveller</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"couple\"> &#128145; Couple</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"friends_small\"> &#129309; Small group (2&ndash;4)</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"friends_large\"> &#127881; Large group (5+)</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"family_kids\"> &#128106; Family &mdash; young kids</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"family_teens\"> &#128104;&#8205;&#128105;&#8205;&#128102; Family &mdash; teens</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"group\" value=\"seniors\"> &#129491; Seniors</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q4: Duration -->\r\n      <div class=\"quiz-question\" data-question=\"4\">\r\n        <p class=\"quiz-q-label\">4. How much time do they have?</p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"duration\" value=\"activity\"> &#9889; Just an Activity &mdash; 1&ndash;2 hrs</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"duration\" value=\"half_day\"> &#127774; Half Day &mdash; 3&ndash;4 hrs</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"duration\" value=\"full_day\"> &#127775; Full Day (breakfast &rarr; activity &rarr; lunch &rarr; activity &rarr; dinner)</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q5: Budget -->\r\n      <div class=\"quiz-question\" data-question=\"5\">\r\n        <p class=\"quiz-q-label\">5. What's the budget?</p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"budget\" value=\"budget\"> &#128176; Budget-friendly</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"budget\" value=\"midrange\"> &#128181; Mid-range</label>\r\n          <label class=\"quiz-option\"><input type=\"radio\" name=\"budget\" value=\"splurge\"> &#128142; Special occasion</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q6: Interests -->\r\n      <div class=\"quiz-question\" data-question=\"6\">\r\n        <p class=\"quiz-q-label\">6. Any particular interests? <span class=\"muted-text quiz-optional\">(optional, pick all that apply)</span></p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"food\"> &#127829; Food &amp; Drinks</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"shopping\"> &#128717; Shopping</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"entertainment\"> &#127917; Live Entertainment</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"outdoors\"> &#127807; Outdoors &amp; Active</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"culture\"> &#127981; Arts &amp; Culture</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"interests\" value=\"local\"> &#128205; Local &amp; Hidden Gems</label>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Q7: Accessibility & special needs -->\r\n      <div class=\"quiz-question\" data-question=\"7\">\r\n        <p class=\"quiz-q-label\">7. Any special considerations? <span class=\"muted-text quiz-optional\">(optional, pick all that apply)</span></p>\r\n        <div class=\"quiz-options quiz-options-grid\">\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"quiet\"> &#128263; Quiet / low-sensory environment</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"no_alcohol\"> &#128683; Alcohol-free options important</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"wheelchair\"> &#9855;&#65039; Wheelchair / mobility accessible</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"outdoor_seating\"> &#127968; Outdoor seating a plus</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"pet_friendly\"> &#128054; Pet-friendly</label>\r\n          <label class=\"quiz-option\"><input type=\"checkbox\" name=\"special\" value=\"kids_activities\"> &#127744; Kid-focused activities</label>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"quiz-error\" id=\"quizError\" hidden></div>\r\n\r\n      <div class=\"quiz-footer\">\r\n        <button type=\"submit\" class=\"btn btn-primary\">Build My Guide &#8594;</button>\r\n        <button type=\"button\" class=\"btn btn-ghost\" id=\"guideQuizCancel\">Cancel</button>\r\n      </div>\r\n    </form>\r\n\r\n    <!-- Inline Results (shown after quiz submit) -->\r\n    <div id=\"quizResults\" hidden>\r\n      <div id=\"quizResultsContent\" class=\"quiz-results-content\"></div>\r\n      <div class=\"quiz-result-footer\">\r\n        <button type=\"button\" class=\"btn btn-primary\" id=\"quizUseGuide\">&#10003; Use This Guide</button>\r\n        <button type=\"button\" class=\"btn btn-ghost btn-sm\" id=\"quizRetry\">&#8592; Change Answers</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n")
  return __output;

},
  "partials/adventure-guide-sidebar": function (locals, escapeFn, include, rethrow) {
var guidePlaces = locals.guidePlaces, places = locals.places;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; 
  // guidePlaces must be defined by the including template
  const _guidePlaces = typeof guidePlaces !== 'undefined'
    ? guidePlaces
    : (typeof places !== 'undefined' ? places : []);

    ; __append("\r\n\r\n<!-- Adventure Guide Builder Sidebar -->\r\n<aside class=\"adventure-guide-sidebar\">\r\n  <div class=\"adventure-guide-card\">\r\n    <div class=\"adventure-guide-header\">\r\n      <button\r\n        type=\"button\"\r\n        class=\"adventure-guide-toggle\"\r\n        id=\"guideToggleBtn\"\r\n        aria-expanded=\"false\"\r\n        aria-controls=\"adventureGuideBody\"\r\n      >\r\n        <span class=\"adventure-guide-icon\">&#9788;</span>\r\n        <span class=\"adventure-guide-title\">Guest Day Itinerary Planner</span>\r\n        <span class=\"adventure-guide-chevron\" aria-hidden=\"true\">&#9662;</span>\r\n      </button>\r\n    </div>\r\n\r\n    <div class=\"adventure-guide-body\" id=\"adventureGuideBody\" hidden>\r\n      <p class=\"muted-text guide-intro-text\">\r\n        Build print-ready guest day itineraries from your current recommendations.\r\n        Add stops by click or drag, then print as a concierge tour guide handout.\r\n      </p>\r\n\r\n      <div class=\"guide-action-row\">\r\n        <button type=\"button\" class=\"btn btn-primary btn-sm\" id=\"guideQuizBtn\">&#10067; Auto-Build with Quiz</button>\r\n        <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"guideSurpriseBtn\">&#127922; Surprise Itinerary</button>\r\n      </div>\r\n\r\n      <!-- Drop Zone -->\r\n      <div class=\"guide-dropzone\" id=\"guideDropzone\" aria-label=\"Guide drop zone\">\r\n        <p class=\"guide-dropzone-placeholder\" id=\"guideDropzonePlaceholder\">Add recommendations here to build the guest itinerary</p>\r\n        <ul class=\"guide-dropzone-list\" id=\"guideDropzoneList\" aria-label=\"Guide items\"></ul>\r\n      </div>\r\n\r\n      <div class=\"guide-dropzone-actions\" id=\"guideDropzoneActions\" hidden>\r\n        <div class=\"guide-stop-row\">\r\n          <input type=\"text\" class=\"guide-name-input\" id=\"guideNameInput\" placeholder=\"Name this itinerary…\" maxlength=\"80\" aria-label=\"Guide name\">\r\n          <span class=\"guide-stop-count\" id=\"guideStopCount\" aria-live=\"polite\"></span>\r\n        </div>\r\n\r\n        <div class=\"guide-itinerary-meta\">\r\n          <input type=\"text\" class=\"guide-name-input\" id=\"guideGuestNameInput\" placeholder=\"Guest name (optional)\" maxlength=\"80\" aria-label=\"Guest name\">\r\n          <input type=\"date\" class=\"guide-template-select\" id=\"guideDateInput\" aria-label=\"Itinerary date\">\r\n        </div>\r\n        <textarea id=\"guideNotesInput\" class=\"guide-notes-input\" rows=\"3\" maxlength=\"240\" placeholder=\"Optional notes for guest preferences, pacing, or accessibility\"></textarea>\r\n\r\n        <div class=\"guide-template-row\">\r\n          <label for=\"guideTemplateSelect\" class=\"guide-template-label\">Display:</label>\r\n          <select id=\"guideTemplateSelect\" class=\"guide-template-select\" aria-label=\"Guide view template\">\r\n            <option value=\"standard\">Itinerary list</option>\r\n            <option value=\"time_of_day\">Timeline (time of day)</option>\r\n          </select>\r\n        </div>\r\n        <div class=\"guide-action-row\">\r\n          <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"guideTimelineBtn\">Assign Timeline</button>\r\n          <button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"guidePrintBtn\">Print Handout</button>\r\n          <button type=\"button\" class=\"btn btn-ghost btn-sm\" id=\"guideClearBtn\">Clear</button>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Source Chips (draggable) -->\r\n      <div class=\"guide-source-section\">\r\n        <p class=\"guide-source-label\">Available recommendations (click or drag to add):</p>\r\n        <input type=\"search\" class=\"guide-chip-search\" id=\"guideChipSearch\" placeholder=\"Search recommendations…\" aria-label=\"Search recommendations\">\r\n        <div class=\"guide-category-filter\" id=\"guideCategoryFilter\" aria-label=\"Filter by category\"></div>\r\n        <div class=\"guide-source-chips\" id=\"guideSourceChips\">\r\n          ")
    ;  if (_guidePlaces.length > 0) { 
    ; __append("\r\n            ")
    ;  _guidePlaces.forEach(function(place) { 
    ; __append("\r\n              <div class=\"guide-chip\"\r\n                   draggable=\"true\"\r\n                   data-place-id=\"")
    ; __append(escapeFn( place.id ))
    ; __append("\"\r\n                   data-place-title=\"")
    ; __append(escapeFn( place.title.replace(/"/g, '&quot;') ))
    ; __append("\"\r\n                   data-place-category=\"")
    ; __append(escapeFn( place.category ))
    ; __append("\"\r\n                   data-place-location=\"")
    ; __append(escapeFn( (place.location || '').replace(/"/g, '&quot;') ))
    ; __append("\"\r\n                   data-place-rating=\"")
    ; __append(escapeFn( place.rating || '' ))
    ; __append("\"\r\n                   role=\"button\"\r\n                   tabindex=\"0\"\r\n                   aria-label=\"Add ")
    ; __append(escapeFn( place.title ))
    ; __append(" to guide\">\r\n                <span class=\"guide-chip-title\">")
    ; __append(escapeFn( place.title ))
    ; __append("</span>\r\n                <span class=\"badge-status badge-category-soft\">")
    ; __append(escapeFn( place.category ))
    ; __append("</span>\r\n                ")
    ;  if (place.rating) { 
    ; __append("<span class=\"guide-chip-rating\" aria-label=\"")
    ; __append(escapeFn( place.rating ))
    ; __append(" stars\">&#9733; ")
    ; __append(escapeFn( Number(place.rating).toFixed(1) ))
    ; __append("</span>")
    ;  } 
    ; __append("\r\n              </div>\r\n            ")
    ;  }) 
    ; __append("\r\n          ")
    ;  } else { 
    ; __append("\r\n            <p class=\"muted-text\">No recommendations available yet.</p>\r\n          ")
    ;  } 
    ; __append("\r\n          <p class=\"muted-text guide-chip-no-results\" id=\"guideChipNoResults\" hidden>No spots match your filter.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</aside>\r\n\r\n<!-- Quiz Modal -->\r\n<script type=\"application/json\" id=\"guidePlacesData\">")
    ; __append( JSON.stringify(_guidePlaces).replace(/</g, '\\u003c') )
    ; __append("</script>\r\n\r\n")
    ; __append( include('./adventure-guide-quiz-modal') )
    ; __append("\r\n\r\n<script src=\"/js/adventure-guide.js\"></script>\r\n")
  return __output;

},
  "partials/coming-soon-modal": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<div class=\"modal-backdrop\" id=\"comingSoonModal\" hidden>\r\n  <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"comingSoonTitle\">\r\n    <div class=\"modal-dialog-head\">\r\n      <h2 id=\"comingSoonTitle\">Coming Soon</h2>\r\n      <button type=\"button\" class=\"modal-close\" id=\"comingSoonClose\" aria-label=\"Close coming soon dialog\">×</button>\r\n    </div>\r\n    <p class=\"modal-copy\" id=\"comingSoonCopy\">This feature is currently in progress.</p>\r\n    <p class=\"modal-copy modal-copy-soft\">You can keep using the currently available tools while we finish this experience.</p>\r\n    <div class=\"modal-actions\">\r\n      <button type=\"button\" class=\"btn btn-primary\" id=\"comingSoonAcknowledge\">Got it</button>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<script>\r\n(function () {\r\n  const modal = document.getElementById('comingSoonModal');\r\n  const title = document.getElementById('comingSoonTitle');\r\n  const copy = document.getElementById('comingSoonCopy');\r\n  const closeButton = document.getElementById('comingSoonClose');\r\n  const acknowledgeButton = document.getElementById('comingSoonAcknowledge');\r\n\r\n  if (!modal || !title || !copy || !closeButton || !acknowledgeButton) {\r\n    return;\r\n  }\r\n\r\n  let lastTrigger = null;\r\n\r\n  const closeModal = function () {\r\n    modal.hidden = true;\r\n    document.body.classList.remove('modal-open');\r\n    if (lastTrigger) {\r\n      lastTrigger.focus();\r\n    }\r\n  };\r\n\r\n  document.querySelectorAll('[data-coming-soon]').forEach(function (trigger) {\r\n    trigger.addEventListener('click', function (event) {\r\n      event.preventDefault();\r\n      lastTrigger = trigger;\r\n      title.textContent = trigger.getAttribute('data-coming-soon-title') || 'Coming Soon';\r\n      copy.textContent = trigger.getAttribute('data-coming-soon') || 'This feature is currently in progress.';\r\n      modal.hidden = false;\r\n      document.body.classList.add('modal-open');\r\n      acknowledgeButton.focus();\r\n    });\r\n  });\r\n\r\n  closeButton.addEventListener('click', closeModal);\r\n  acknowledgeButton.addEventListener('click', closeModal);\r\n  modal.addEventListener('click', function (event) {\r\n    if (event.target === modal) {\r\n      closeModal();\r\n    }\r\n  });\r\n\r\n  document.addEventListener('keydown', function (event) {\r\n    if (event.key === 'Escape' && !modal.hidden) {\r\n      closeModal();\r\n    }\r\n  });\r\n})();\r\n</script>\r\n")
  return __output;

},
  "partials/footer": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<footer class=\"footer\">\r\n  <nav class=\"footer-links\" aria-label=\"Footer links\">\r\n    <a href=\"/support\">Support</a>\r\n    <a href=\"/support/faq\">FAQ</a>\r\n    <a href=\"/support/contact\">Contact</a>\r\n    <a href=\"/support/suggestions\">Suggestion Box</a>\r\n  </nav>\r\n  <p>&copy; 2026 Hotel Concierge Service. All rights reserved.</p>\r\n</footer>\r\n\r\n<script>\r\n(function () {\r\n  const btn = document.getElementById('locationBtn');\r\n  const dropdown = btn && btn.closest('.location-dropdown');\r\n  if (!btn || !dropdown) return;\r\n\r\n  btn.addEventListener('click', function (e) {\r\n    e.stopPropagation();\r\n    dropdown.classList.toggle('open');\r\n  });\r\n\r\n  document.addEventListener('click', function () {\r\n    dropdown.classList.remove('open');\r\n  });\r\n})();\r\n</script>\r\n")
  return __output;

},
  "partials/navbar": function (locals, escapeFn, include, rethrow) {
var interfaceTheme = locals.interfaceTheme, isDemoUser = locals.isDemoUser, platformConfig = locals.platformConfig, timeZone = locals.timeZone, timeLocale = locals.timeLocale, formatDateTime = locals.formatDateTime, now = locals.now, availableCities = locals.availableCities, city = locals.city, user = locals.user;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<script>\r\n  document.documentElement.setAttribute('data-theme', '")
    ; __append(escapeFn( interfaceTheme || "light" ))
    ; __append("');\r\n</script>\r\n")
    ;  if (isDemoUser) { 
    ; __append("\r\n<div style=\"background:#1a1a2e;color:#e0e0ff;text-align:center;padding:8px 16px;font-size:0.85rem;letter-spacing:0.03em;\">\r\n  <strong>Demo Mode</strong> &mdash; Explore SOVA Scoop. Changes are private to this session and reset when you log out; file uploads are disabled.\r\n</div>\r\n")
    ;  } 
    ; __append("\r\n<nav class=\"navbar\">\r\n  <div class=\"nav-container\">\r\n    <div class=\"nav-brand\">\r\n      <a href=\"/\">")
    ; __append(escapeFn( (platformConfig && platformConfig.platform_name) || 'SOVA Scoop' ))
    ; __append("</a>\r\n      <div class=\"location-btn location-btn-static\" id=\"platformClock\" data-time-zone=\"")
    ; __append(escapeFn( timeZone || 'America/Chicago' ))
    ; __append("\" data-time-locale=\"")
    ; __append(escapeFn( timeLocale || 'en-US' ))
    ; __append("\">\r\n        <span>🕒 ")
    ; __append(escapeFn( formatDateTime(now) ))
    ; __append("</span>\r\n      </div>\r\n      <div class=\"location-dropdown\">\r\n        ")
    ;  const cityOptions = Array.isArray(availableCities) && availableCities.length ? availableCities : ['DALLAS', 'AUSTIN']; 
    ; __append("\r\n        ")
    ;  if (cityOptions.length > 1) { 
    ; __append("\r\n          <button class=\"location-btn\" id=\"locationBtn\">\r\n            <span id=\"selectedLocation\">📍 ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n            <span class=\"location-arrow\">▾</span>\r\n          </button>\r\n          <ul class=\"location-menu\" id=\"locationMenu\">\r\n            ")
    ;  cityOptions.forEach(option => { 
    ; __append("\r\n              <li class=\"location-item ")
    ; __append(escapeFn( city === option ? 'active' : '' ))
    ; __append("\"><a href=\"/location/set?city=")
    ; __append(escapeFn( option ))
    ; __append("\">📍 ")
    ; __append(escapeFn( option ))
    ; __append("</a></li>\r\n            ")
    ;  }) 
    ; __append("\r\n          </ul>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"location-btn location-btn-static\">\r\n            <span id=\"selectedLocation\">📍 ")
    ; __append(escapeFn( city ))
    ; __append("</span>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </div>\r\n    <ul class=\"nav-menu\">\r\n      <li><a href=\"/places\">Recommendations</a></li>\r\n      ")
    ;  if (user) { 
    ; __append("\r\n        ")
    ;  const role = user.role ? user.role.toLowerCase() : ''; 
    ; __append("\r\n        <li><a href=\"/events\">Events</a></li>\r\n        ")
    ;  if (role === 'admin' || role === 'management') { 
    ; __append("\r\n          <li><a href=\"/admin\">")
    ; __append(escapeFn( role === 'management' ? 'Management Workspace' : 'Admin Workspace' ))
    ; __append("</a></li>\r\n        ")
    ;  } else if (role === 'employee') { 
    ; __append("\r\n          <li><a href=\"/employee\">Employee Workspace</a></li>\r\n        ")
    ;  } 
    ; __append("\r\n        <li><a href=\"/reservations\">Reservations</a></li>\r\n        <li><a href=\"/account/profile\">My Profile</a></li>\r\n        <li><a href=\"/auth/logout\">Logout (")
    ; __append(escapeFn( user.username ))
    ; __append(")</a></li>\r\n      ")
    ;  } else { 
    ; __append("\r\n        <li><a href=\"/auth/login\">Login</a></li>\r\n        <li><a href=\"/auth/register\">Sign Up</a></li>\r\n      ")
    ;  } 
    ; __append("\r\n    </ul>\r\n  </div>\r\n</nav>\r\n\r\n<script>\r\n  (function () {\r\n    const clock = document.getElementById('platformClock');\r\n    if (!clock) {\r\n      return;\r\n    }\r\n\r\n    const locale = clock.getAttribute('data-time-locale') || 'en-US';\r\n    const timeZone = clock.getAttribute('data-time-zone') || 'America/Chicago';\r\n    const formatter = new Intl.DateTimeFormat(locale, {\r\n      timeZone,\r\n      month: 'short',\r\n      day: 'numeric',\r\n      year: 'numeric',\r\n      hour: 'numeric',\r\n      minute: '2-digit'\r\n    });\r\n\r\n    const render = function () {\r\n      clock.innerHTML = '<span>🕒 ' + formatter.format(new Date()) + '</span>';\r\n    };\r\n\r\n    render();\r\n    setInterval(render, 30000);\r\n  })();\r\n</script>\r\n")
  return __output;

},
  "places/detail": function (locals, escapeFn, include, rethrow) {
var place = locals.place, user = locals.user, relatedEvents = locals.relatedEvents, formatDate = locals.formatDate, formatTime = locals.formatTime, likes = locals.likes, comments = locals.comments, userLiked = locals.userLiked, employeeRatingCount = locals.employeeRatingCount, employeeRatingAverage = locals.employeeRatingAverage, userEmployeeRating = locals.userEmployeeRating;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>")
    ; __append(escapeFn( place.title ))
    ; __append(" - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  ")
    ;  const role = user ? String(user.role || '').toLowerCase() : ''; 
    ; __append("\r\n  ")
    ;  const canEditPlace = ['employee', 'management', 'admin'].includes(role); 
    ; __append("\r\n  ")
    ;  const canDeletePlace = ['management', 'admin'].includes(role); 
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"place-detail\">\r\n      <div class=\"place-detail-nav\">\r\n        <a href=\"/places\" class=\"btn btn-secondary\">← Back to Recommendations</a>\r\n        <a href=\"/\" class=\"btn btn-secondary\">Home</a>\r\n      </div>\r\n\r\n      <div class=\"detail-header\">\r\n        ")
    ;  if (Number(place.is_coming_soon || 0) === 1) { 
    ; __append("\r\n          <p><span class=\"badge-status badge-pending\">Coming Soon</span></p>\r\n        ")
    ;  } 
    ; __append("\r\n        <h1>")
    ; __append(escapeFn( place.title ))
    ; __append("</h1>\r\n        <span class=\"category-badge\">")
    ; __append(escapeFn( place.category ))
    ; __append("</span>\r\n        ")
    ;  if (place.rating) { 
    ; __append("\r\n          <div class=\"rating\">⭐ ")
    ; __append(escapeFn( place.rating ))
    ; __append("/5.0</div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      ")
    ;  if (place.tags) { 
    ; __append("\r\n        <div class=\"place-tags detail-tags\">\r\n          ")
    ;  place.tags.split(',').map(t => t.trim()).filter(t => t).forEach(tag => { 
    ; __append("\r\n            <a href=\"/places?search=")
    ; __append(escapeFn( encodeURIComponent(tag) ))
    ; __append("\" class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</a>\r\n          ")
    ;  }) 
    ; __append("\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <div class=\"detail-info\">\r\n        <div class=\"info-section\">\r\n          <h3>Location</h3>\r\n          <p>")
    ; __append(escapeFn( place.location ))
    ; __append("</p>\r\n          ")
    ;  if (place.address) { 
    ; __append("\r\n            <p><strong>Address:</strong> ")
    ; __append(escapeFn( place.address ))
    ; __append("</p>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n\r\n        ")
    ;  if (place.phone) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>Phone</h3>\r\n            <p><a href=\"tel:")
    ; __append(escapeFn( place.phone ))
    ; __append("\">")
    ; __append(escapeFn( place.phone ))
    ; __append("</a></p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (place.website) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>Website</h3>\r\n            <p><a href=\"")
    ; __append(escapeFn( place.website ))
    ; __append("\" target=\"_blank\">")
    ; __append(escapeFn( place.website ))
    ; __append("</a></p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (place.hasBusinessHours) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>Business Hours</h3>\r\n            <p>")
    ; __append(escapeFn( place.businessHoursLabel ))
    ; __append("</p>\r\n            <p><span class=\"badge-status ")
    ; __append(escapeFn( place.isOpenNow ? 'badge-approved' : 'badge-draft' ))
    ; __append("\">")
    ; __append(escapeFn( place.openStatusLabel ))
    ; __append("</span></p>\r\n            ")
    ;  if (place.closedDaysLabel) { 
    ; __append("\r\n              <p><strong>Closed:</strong> ")
    ; __append(escapeFn( place.closedDaysLabel ))
    ; __append("</p>\r\n            ")
    ;  } 
    ; __append("\r\n            ")
    ;  if (place.holidayNotice) { 
    ; __append("\r\n              <p class=\"muted-text\">Holiday might affect these hours</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else if (place.closedDaysLabel) { 
    ; __append("\r\n          <div class=\"info-section\">\r\n            <h3>Closed Days</h3>\r\n            <p>")
    ; __append(escapeFn( place.closedDaysLabel ))
    ; __append("</p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"detail-description\">\r\n        <h2>About</h2>\r\n        <p>")
    ; __append(escapeFn( place.detailed_description ))
    ; __append("</p>\r\n      </div>\r\n\r\n      ")
    ;  if (place.walking_directions || place.google_maps_link || place.transit_lines) { 
    ; __append("\r\n        <div class=\"detail-description\">\r\n          <h2>Getting There</h2>\r\n          ")
    ;  if (place.walking_directions) { 
    ; __append("\r\n            <p><strong>Walking Directions:</strong> ")
    ; __append(escapeFn( place.walking_directions ))
    ; __append("</p>\r\n          ")
    ;  } 
    ; __append("\r\n          ")
    ;  if (place.transit_lines) { 
    ; __append("\r\n            <p><strong>Bus and Train Lines:</strong> ")
    ; __append(escapeFn( place.transit_lines ))
    ; __append("</p>\r\n          ")
    ;  } 
    ; __append("\r\n          ")
    ;  if (place.google_maps_link) { 
    ; __append("\r\n            <p><strong>Map:</strong> <a href=\"")
    ; __append(escapeFn( place.google_maps_link ))
    ; __append("\" target=\"_blank\" rel=\"noopener noreferrer\">Open in Google Maps</a></p>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (relatedEvents && relatedEvents.length) { 
    ; __append("\r\n        <div class=\"detail-description\">\r\n          <h2>Related Events</h2>\r\n          <div class=\"discussion-comments-list\">\r\n            ")
    ;  relatedEvents.forEach((event) => { 
    ; __append("\r\n              <article class=\"discussion-comment-card\">\r\n                <div class=\"discussion-comment-body\" style=\"padding-left:0;\">\r\n                  <div class=\"discussion-comment-meta\">\r\n                    <strong><a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\">")
    ; __append(escapeFn( event.title ))
    ; __append("</a></strong>\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( event.category ))
    ; __append("</span>\r\n                    ")
    ;  if ((event.related_place_relation || '').toLowerCase() === 'at') { 
    ; __append("\r\n                      <span>At this location</span>\r\n                    ")
    ;  } else if ((event.related_place_relation || '').toLowerCase() === 'by') { 
    ; __append("\r\n                      <span>Hosted by this place</span>\r\n                    ")
    ;  } 
    ; __append("\r\n                  </div>\r\n                  <p class=\"muted-text\">\r\n                    ")
    ;  if (event.start_at) { 
    ; __append("\r\n                      ")
    ; __append(escapeFn( formatDate(event.start_at, { month: 'short', day: 'numeric', year: 'numeric' }) ))
    ; __append(" at ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                    ")
    ;  } 
    ; __append("\r\n                    ")
    ;  if (event.end_at) { 
    ; __append("\r\n                      - ")
    ; __append(escapeFn( formatTime(event.end_at) ))
    ; __append("\r\n                    ")
    ;  } 
    ; __append("\r\n                    • ")
    ; __append(escapeFn( (event.recurrence_type || 'one_time') === 'recurring' ? 'Recurring' : 'One-time' ))
    ; __append("\r\n                  </p>\r\n                  ")
    ;  if (event.tags) { 
    ; __append("\r\n                    <div class=\"place-tags\" style=\"margin-top: 0.35rem;\">\r\n                      ")
    ;  event.tags.split(',').map((tag) => tag.trim()).filter(Boolean).forEach((tag) => { 
    ; __append("\r\n                        <span class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</span>\r\n                      ")
    ;  }) 
    ; __append("\r\n                    </div>\r\n                  ")
    ;  } 
    ; __append("\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <div class=\"detail-description\">\r\n        <h2>Community</h2>\r\n        <p><strong>")
    ; __append(escapeFn( likes.length ))
    ; __append("</strong> like")
    ; __append(escapeFn( likes.length === 1 ? '' : 's' ))
    ; __append(" • <strong>")
    ; __append(escapeFn( comments.length ))
    ; __append("</strong> comment")
    ; __append(escapeFn( comments.length === 1 ? '' : 's' ))
    ; __append("</p>\r\n\r\n        ")
    ;  if (user) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/like\" style=\"margin-top: 0.75rem;\">\r\n            <button type=\"submit\" class=\"btn btn-secondary\">")
    ; __append(escapeFn( userLiked ? 'Unlike' : 'Like' ))
    ; __append(" Recommendation</button>\r\n          </form>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\" style=\"margin-top: 0.75rem;\">Log in to like and comment.</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (likes.length) { 
    ; __append("\r\n          <p class=\"muted-text\" style=\"margin-top: 0.75rem;\">\r\n            Liked by: ")
    ; __append(escapeFn( likes.map((entry) => entry.username).join(', ') ))
    ; __append("\r\n          </p>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"detail-description\">\r\n        <h2>Employee Rating</h2>\r\n        ")
    ;  if (employeeRatingCount > 0) { 
    ; __append("\r\n          <p><strong>")
    ; __append(escapeFn( employeeRatingAverage.toFixed(1) ))
    ; __append("</strong>/5 from ")
    ; __append(escapeFn( employeeRatingCount ))
    ; __append(" staff rating")
    ; __append(escapeFn( employeeRatingCount === 1 ? '' : 's' ))
    ; __append(".</p>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">No employee ratings yet.</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (user) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/employee-rating\" style=\"margin-top: 0.75rem; display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;\">\r\n            <label for=\"employee-rating\"><strong>Your rating</strong></label>\r\n            <select id=\"employee-rating\" name=\"rating\" required>\r\n              ")
    ;  for (let value = 1; value <= 5; value += 1) { 
    ; __append("\r\n                <option value=\"")
    ; __append(escapeFn( value ))
    ; __append("\" ")
    ; __append(escapeFn( userEmployeeRating === value ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( value ))
    ; __append("</option>\r\n              ")
    ;  } 
    ; __append("\r\n            </select>\r\n            <button type=\"submit\" class=\"btn btn-secondary\">")
    ; __append(escapeFn( userEmployeeRating ? 'Update Rating' : 'Save Rating' ))
    ; __append("</button>\r\n          </form>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"detail-description\" id=\"recommendation-comments\">\r\n        <h2>Comments</h2>\r\n        ")
    ;  if (comments.length) { 
    ; __append("\r\n          <div class=\"discussion-comments-list\">\r\n            ")
    ;  comments.forEach((comment) => { 
    ; __append("\r\n              <article class=\"discussion-comment-card\">\r\n                <div class=\"discussion-comment-avatar\">")
    ; __append(escapeFn( (comment.username || '?').charAt(0).toUpperCase() ))
    ; __append("</div>\r\n                <div class=\"discussion-comment-body\">\r\n                  <div class=\"discussion-comment-meta\">\r\n                    <strong>")
    ; __append(escapeFn( comment.username ))
    ; __append("</strong>\r\n                    <span class=\"badge-status badge-")
    ; __append(escapeFn( (comment.role || 'user').toLowerCase() ))
    ; __append("\">")
    ; __append(escapeFn( comment.role || 'user' ))
    ; __append("</span>\r\n                    <span>")
    ; __append(escapeFn( new Date(comment.created_at).toLocaleDateString() ))
    ; __append("</span>\r\n                  </div>\r\n                  <p>")
    ; __append(escapeFn( comment.comment_text ))
    ; __append("</p>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"muted-text\">No comments yet.</p>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        ")
    ;  if (user) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/comments\" class=\"discussion-comment-form\" style=\"margin-top: 1rem;\">\r\n            <label for=\"recommendation-comment\" class=\"discussion-comment-label\">Add a comment</label>\r\n            <div class=\"discussion-comment-composer\">\r\n              <textarea id=\"recommendation-comment\" name=\"comment_text\" rows=\"4\" maxlength=\"1000\" required placeholder=\"Share what guests should know.\"></textarea>\r\n              <div class=\"discussion-comment-actions\">\r\n                <span class=\"discussion-comment-helper\">Keep it specific and useful for the concierge team.</span>\r\n                <button type=\"submit\" class=\"btn btn-primary btn-sm\">Post Comment</button>\r\n              </div>\r\n            </div>\r\n          </form>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <!-- Reserve a Visit -->\r\n      <div class=\"reservation-cta\">\r\n        <h2>Ready to Visit?</h2>\r\n        ")
    ;  if (place.reservation_link || place.menu_link || place.events_link) { 
    ; __append("\r\n          <p>Book a table, browse the menu, or check out upcoming events.</p>\r\n          <div class=\"reservation-cta-actions\">\r\n            ")
    ;  if (place.reservation_link) { 
    ; __append("\r\n              <a href=\"")
    ; __append(escapeFn( place.reservation_link ))
    ; __append("\" class=\"reservation-text-link\" target=\"_blank\" rel=\"noopener noreferrer\">Make a Reservation</a>\r\n            ")
    ;  } 
    ; __append("\r\n            ")
    ;  if (place.menu_link) { 
    ; __append("\r\n              <a href=\"")
    ; __append(escapeFn( place.menu_link ))
    ; __append("\" class=\"reservation-text-link\" target=\"_blank\" rel=\"noopener noreferrer\">View Menu</a>\r\n            ")
    ;  } 
    ; __append("\r\n            ")
    ;  if (place.events_link) { 
    ; __append("\r\n              <a href=\"")
    ; __append(escapeFn( place.events_link ))
    ; __append("\" class=\"reservation-text-link\" target=\"_blank\" rel=\"noopener noreferrer\">View Events</a>\r\n            ")
    ;  } 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <p class=\"reservation-empty\">No available links yet, check back soon!</p>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (canEditPlace) { 
    ; __append("\r\n          <a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/edit\" class=\"reservation-edit-link\">+ Add or Edit Links</a>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <div class=\"place-actions\">\r\n        <a href=\"/places\" class=\"btn btn-secondary\">← Back to Recommendations</a>\r\n        ")
    ;  if (canEditPlace) { 
    ; __append("\r\n          <a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/edit\" class=\"btn btn-primary\">Edit</a>\r\n        ")
    ;  } 
    ; __append("\r\n        ")
    ;  if (canDeletePlace) { 
    ; __append("\r\n          <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/delete?_method=DELETE\" style=\"display:inline;\">\r\n            <button\r\n              type=\"button\"\r\n              class=\"btn btn-danger js-delete-trigger\"\r\n              data-delete-action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/delete?_method=DELETE\"\r\n              data-place-title=\"")
    ; __append(escapeFn( place.title ))
    ; __append("\"\r\n            >Delete</button>\r\n          </form>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ;  if (canDeletePlace) { 
    ; __append("\r\n    <div class=\"modal-backdrop\" id=\"placeDeleteModal\" hidden>\r\n      <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"placeDeleteModalTitle\">\r\n        <div class=\"modal-dialog-head\">\r\n          <h2 id=\"placeDeleteModalTitle\">Delete Recommendation</h2>\r\n          <button type=\"button\" class=\"modal-close\" id=\"placeDeleteModalClose\" aria-label=\"Close delete dialog\">×</button>\r\n        </div>\r\n        <p class=\"modal-copy\" id=\"placeDeleteModalCopy\">Delete this recommendation permanently?</p>\r\n        <p class=\"modal-copy modal-copy-soft\">This permanently removes the recommendation and cannot be undone from the recommendations workspace.</p>\r\n        <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/delete?_method=DELETE\" id=\"placeDeleteModalForm\" class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"placeDeleteModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-danger\">Delete Recommendation</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n\r\n    <script>\r\n    (function () {\r\n      const modal = document.getElementById('placeDeleteModal');\r\n      const modalForm = document.getElementById('placeDeleteModalForm');\r\n      const modalCopy = document.getElementById('placeDeleteModalCopy');\r\n      const closeButton = document.getElementById('placeDeleteModalClose');\r\n      const cancelButton = document.getElementById('placeDeleteModalCancel');\r\n      const trigger = document.querySelector('.js-delete-trigger');\r\n\r\n      if (!modal || !modalForm || !modalCopy || !closeButton || !cancelButton || !trigger) {\r\n        return;\r\n      }\r\n\r\n      const closeModal = function () {\r\n        modal.hidden = true;\r\n        document.body.classList.remove('modal-open');\r\n        trigger.focus();\r\n      };\r\n\r\n      trigger.addEventListener('click', function () {\r\n        modalForm.action = trigger.getAttribute('data-delete-action');\r\n        modalCopy.textContent = 'Delete \"' + trigger.getAttribute('data-place-title') + '\" permanently?';\r\n        modal.hidden = false;\r\n        document.body.classList.add('modal-open');\r\n        closeButton.focus();\r\n      });\r\n\r\n      closeButton.addEventListener('click', closeModal);\r\n      cancelButton.addEventListener('click', closeModal);\r\n      modal.addEventListener('click', function (event) {\r\n        if (event.target === modal) {\r\n          closeModal();\r\n        }\r\n      });\r\n\r\n      document.addEventListener('keydown', function (event) {\r\n        if (event.key === 'Escape' && !modal.hidden) {\r\n          closeModal();\r\n        }\r\n      });\r\n    })();\r\n    </script>\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "places/edit": function (locals, escapeFn, include, rethrow) {
var missingFields = locals.missingFields, message = locals.message, place = locals.place;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Edit Recommendation - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    <div class=\"form-container\">\r\n      <h1>Edit Recommendation</h1>\r\n      <p class=\"queue-page-intro\">Changes go live as soon as you save them.</p>\r\n      ")
    ;  const missingFieldValues = (typeof missingFields !== 'undefined' && Array.isArray(missingFields)) ? missingFields : []; 
    ; __append("\r\n      ")
    ;  const missingFieldSet = new Set(missingFieldValues); 
    ; __append("\r\n      \r\n      ")
    ;  if (typeof message !== 'undefined') { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/update?_method=PUT\">\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('title') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"title\">Place Name *</label>\r\n          <input type=\"text\" id=\"title\" name=\"title\" value=\"")
    ; __append(escapeFn( place.title ))
    ; __append("\" data-required-label=\"Place Name\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('title') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('category') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"category\">Category *</label>\r\n          <select id=\"category\" name=\"category\" data-required-label=\"Category\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('category') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n            <option value=\"Restaurant\" ")
    ;  if (place.category === 'Restaurant') { 
    ; __append("selected")
    ;  } 
    ; __append(">Restaurant</option>\r\n            <option value=\"Bar\" ")
    ;  if (place.category === 'Bar') { 
    ; __append("selected")
    ;  } 
    ; __append(">Bar</option>\r\n            <option value=\"Speakeasy\" ")
    ;  if (place.category === 'Speakeasy') { 
    ; __append("selected")
    ;  } 
    ; __append(">Speakeasy</option>\r\n            <option value=\"Entertainment\" ")
    ;  if (place.category === 'Entertainment') { 
    ; __append("selected")
    ;  } 
    ; __append(">Entertainment</option>\r\n            <option value=\"Cafe\" ")
    ;  if (place.category === 'Cafe') { 
    ; __append("selected")
    ;  } 
    ; __append(">Cafe</option>\r\n            <option value=\"Shop\" ")
    ;  if (place.category === 'Shop') { 
    ; __append("selected")
    ;  } 
    ; __append(">Shop</option>\r\n            <option value=\"Business\" ")
    ;  if (place.category === 'Business') { 
    ; __append("selected")
    ;  } 
    ; __append(">Business</option>\r\n            <option value=\"Tour\" ")
    ;  if (place.category === 'Tour') { 
    ; __append("selected")
    ;  } 
    ; __append(">Tour</option>\r\n            <option value=\"Experience\" ")
    ;  if (place.category === 'Experience') { 
    ; __append("selected")
    ;  } 
    ; __append(">Experience</option>\r\n            <option value=\"Grocery Store\" ")
    ;  if (place.category === 'Grocery Store') { 
    ; __append("selected")
    ;  } 
    ; __append(">Grocery Store</option>\r\n            <option value=\"Market\" ")
    ;  if (place.category === 'Market') { 
    ; __append("selected")
    ;  } 
    ; __append(">Market</option>\r\n            <option value=\"Mall\" ")
    ;  if (place.category === 'Mall') { 
    ; __append("selected")
    ;  } 
    ; __append(">Mall</option>\r\n            <option value=\"Library\" ")
    ;  if (place.category === 'Library') { 
    ; __append("selected")
    ;  } 
    ; __append(">Library</option>\r\n            <option value=\"Gym\" ")
    ;  if (place.category === 'Gym') { 
    ; __append("selected")
    ;  } 
    ; __append(">Gym</option>\r\n            <option value=\"Other\" ")
    ;  if (place.category === 'Other') { 
    ; __append("selected")
    ;  } 
    ; __append(">Other</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"short_description\">Short Description</label>\r\n          <input type=\"text\" id=\"short_description\" name=\"short_description\" value=\"")
    ; __append(escapeFn( place.short_description ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('detailed_description') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"detailed_description\">Detailed Description *</label>\r\n          <textarea id=\"detailed_description\" name=\"detailed_description\" rows=\"6\" data-required-label=\"Detailed Description\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('detailed_description') ? 'field--missing' : '' ))
    ; __append("\" required>")
    ; __append(escapeFn( place.detailed_description ))
    ; __append("</textarea>\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('location') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"location\">Location/Area *</label>\r\n          <input type=\"text\" id=\"location\" name=\"location\" value=\"")
    ; __append(escapeFn( place.location ))
    ; __append("\" data-required-label=\"Location/Area\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('location') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"address\">Address</label>\r\n          <input type=\"text\" id=\"address\" name=\"address\" value=\"")
    ; __append(escapeFn( place.address ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"phone\">Phone Number</label>\r\n          <input type=\"tel\" id=\"phone\" name=\"phone\" value=\"")
    ; __append(escapeFn( place.phone ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"website\">Website</label>\r\n          <input type=\"text\" id=\"website\" name=\"website\" value=\"")
    ; __append(escapeFn( place.website || '' ))
    ; __append("\" placeholder=\"Optional website\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>Opening Time</label>\r\n          <div class=\"time-picker-wrap\">\r\n            <button type=\"button\" class=\"time-picker-btn\" data-time-target=\"opening_time\" data-init-time=\"")
    ; __append(escapeFn( place.opening_time || '' ))
    ; __append("\">Select opening time</button>\r\n            <input type=\"hidden\" id=\"opening_time\" name=\"opening_time\" value=\"")
    ; __append(escapeFn( place.opening_time || '' ))
    ; __append("\">\r\n          </div>\r\n          <small class=\"form-hint\">Use local property time.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>Closing Time</label>\r\n          <div class=\"time-picker-wrap\">\r\n            <button type=\"button\" class=\"time-picker-btn\" data-time-target=\"closing_time\" data-init-time=\"")
    ; __append(escapeFn( place.closing_time || '' ))
    ; __append("\">Select closing time</button>\r\n            <input type=\"hidden\" id=\"closing_time\" name=\"closing_time\" value=\"")
    ; __append(escapeFn( place.closing_time || '' ))
    ; __append("\">\r\n          </div>\r\n          <small class=\"form-hint\">If closing after midnight, set the next-day closing time.</small>\r\n        </div>\r\n\r\n        ")
    ;  const allWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
    ; __append("\r\n        ")
    ;  const selectedClosedDays = place?.closed_days ? String(place.closed_days).split(',').map((day) => day.trim()).filter(Boolean) : []; 
    ; __append("\r\n        <div class=\"form-group\">\r\n          <label>Closed Days</label>\r\n          <div class=\"days-picker-wrap\">\r\n            <button type=\"button\" class=\"days-picker-btn\" id=\"closed-days-btn\">Select closed days</button>\r\n            <div class=\"days-picker-popup\" id=\"closed-days-popup\" hidden>\r\n              <div class=\"days-picker-grid\">\r\n                ")
    ;  allWeekdays.forEach((day) => { 
    ; __append("\r\n                  <label class=\"day-chip ")
    ; __append(escapeFn( selectedClosedDays.includes(day) ? 'selected' : '' ))
    ; __append("\">\r\n                    <input type=\"checkbox\" name=\"closed_days\" value=\"")
    ; __append(escapeFn( day ))
    ; __append("\" ")
    ; __append(escapeFn( selectedClosedDays.includes(day) ? 'checked' : '' ))
    ; __append(" hidden>\r\n                    ")
    ; __append(escapeFn( day.slice(0, 3) ))
    ; __append("\r\n                  </label>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n              <button type=\"button\" class=\"days-picker-done\">Done</button>\r\n            </div>\r\n          </div>\r\n          <small class=\"form-hint\">Select days when this place may be closed.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>\r\n            <input type=\"checkbox\" name=\"is_coming_soon\" value=\"1\" ")
    ; __append(escapeFn( Number(place.is_coming_soon || 0) === 1 ? 'checked' : '' ))
    ; __append(">\r\n            Mark as Coming Soon\r\n          </label>\r\n          <small class=\"form-hint\">Use this for places not yet open to guests.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"walking_directions\">Walking Directions</label>\r\n          <textarea id=\"walking_directions\" name=\"walking_directions\" rows=\"4\" placeholder=\"Example: Exit the hotel lobby, turn right on Main St, and walk two blocks.\">")
    ; __append(escapeFn( place.walking_directions || '' ))
    ; __append("</textarea>\r\n          <small class=\"form-hint\">Short walking directions guests can follow from the property or nearby landmark</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"google_maps_link\">Google Maps Link</label>\r\n          <input type=\"url\" id=\"google_maps_link\" name=\"google_maps_link\" value=\"")
    ; __append(escapeFn( place.google_maps_link || '' ))
    ; __append("\" placeholder=\"https://maps.google.com/...\">\r\n          <small class=\"form-hint\">Optional direct map or walking route link</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"transit_lines\">Bus and Train Lines</label>\r\n          <input type=\"text\" id=\"transit_lines\" name=\"transit_lines\" value=\"")
    ; __append(escapeFn( place.transit_lines || '' ))
    ; __append("\" placeholder=\"Example: Bus 3, Bus 801, Red Line\">\r\n          <small class=\"form-hint\">List the nearest bus routes, train lines, or transit stops guests can use</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"reservation_link\">Reservation Link</label>\r\n          <input type=\"url\" id=\"reservation_link\" name=\"reservation_link\" value=\"")
    ; __append(escapeFn( place.reservation_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Direct URL where guests can make a reservation</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"menu_link\">Menu Link</label>\r\n          <input type=\"url\" id=\"menu_link\" name=\"menu_link\" value=\"")
    ; __append(escapeFn( place.menu_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Optional URL to the venue's food or drink menu</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"events_link\">Events Link</label>\r\n          <input type=\"url\" id=\"events_link\" name=\"events_link\" value=\"")
    ; __append(escapeFn( place.events_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Optional URL to the venue's events or bookings page</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"rating\">Rating (1-5)</label>\r\n          <input type=\"number\" id=\"rating\" name=\"rating\" min=\"1\" max=\"5\" step=\"0.1\" value=\"")
    ; __append(escapeFn( place.rating ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"tag_input\">Tags</label>\r\n          <div class=\"tags-input-wrap\" id=\"tags_input_wrap\">\r\n            <input\r\n              type=\"text\"\r\n              id=\"tag_input\"\r\n              class=\"tag-entry-input\"\r\n              placeholder=\"Type a tag and press Enter\"\r\n              autocomplete=\"off\"\r\n            >\r\n          </div>\r\n          <input type=\"hidden\" id=\"tags\" name=\"tags\" value=\"")
    ; __append(escapeFn( place.tags || '' ))
    ; __append("\">\r\n          <small class=\"form-hint\">Press Enter to add each tag before saving.</small>\r\n        </div>\r\n\r\n        <div class=\"form-actions\">\r\n          <button type=\"submit\" name=\"submit_action\" value=\"publish\" class=\"btn btn-primary\">Save And Publish</button>\r\n          <button type=\"submit\" name=\"submit_action\" value=\"draft\" class=\"btn btn-secondary\">Save As Draft</button>\r\n          <a href=\"/places/my-recommendations\" class=\"btn btn-secondary\">Cancel</a>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </main>\r\n\r\n  <script>\r\n    (() => {\r\n      // ── Clock popup ──────────────────────────────────────────────\r\n      const fmt24to12 = (val) => {\r\n        if (!val) return '';\r\n        const [hStr, mStr] = val.split(':');\r\n        const h = parseInt(hStr, 10);\r\n        const m = parseInt(mStr, 10);\r\n        const mer = h >= 12 ? 'PM' : 'AM';\r\n        const dh = (h % 12) || 12;\r\n        return `${dh}:${String(m).padStart(2, '0')} ${mer}`;\r\n      };\r\n\r\n      const buildClockPopup = () => {\r\n        const popup = document.createElement('div');\r\n        popup.className = 'clock-popup';\r\n        popup.hidden = true;\r\n\r\n        // preview bar\r\n        const preview = document.createElement('div');\r\n        preview.className = 'clock-preview';\r\n        preview.textContent = '--:-- --';\r\n\r\n        // hours section\r\n        const hoursLabel = document.createElement('div');\r\n        hoursLabel.className = 'clock-section-label';\r\n        hoursLabel.textContent = 'Hour';\r\n        const hoursGrid = document.createElement('div');\r\n        hoursGrid.className = 'clock-hours-grid';\r\n        for (let h = 1; h <= 12; h++) {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'hour'; b.dataset.val = String(h); b.textContent = h;\r\n          hoursGrid.appendChild(b);\r\n        }\r\n\r\n        // minutes section\r\n        const minsLabel = document.createElement('div');\r\n        minsLabel.className = 'clock-section-label';\r\n        minsLabel.textContent = 'Minute';\r\n        const minsRow = document.createElement('div');\r\n        minsRow.className = 'clock-mins-row';\r\n        [0, 15, 30, 45].forEach((m) => {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'min';\r\n          b.dataset.val = String(m).padStart(2, '0');\r\n          b.textContent = `:${String(m).padStart(2, '0')}`;\r\n          minsRow.appendChild(b);\r\n        });\r\n\r\n        // meridiem section\r\n        const merLabel = document.createElement('div');\r\n        merLabel.className = 'clock-section-label';\r\n        merLabel.textContent = 'Period';\r\n        const merRow = document.createElement('div');\r\n        merRow.className = 'clock-mer-row';\r\n        ['AM', 'PM'].forEach((mer) => {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'mer'; b.dataset.val = mer; b.textContent = mer;\r\n          merRow.appendChild(b);\r\n        });\r\n\r\n        // action buttons\r\n        const actions = document.createElement('div');\r\n        actions.className = 'clock-actions';\r\n        const doneBtn = document.createElement('button');\r\n        doneBtn.type = 'button'; doneBtn.className = 'clock-done'; doneBtn.textContent = 'Set Time';\r\n        const clearBtn = document.createElement('button');\r\n        clearBtn.type = 'button'; clearBtn.className = 'clock-clear'; clearBtn.textContent = 'Clear';\r\n        actions.appendChild(doneBtn);\r\n        actions.appendChild(clearBtn);\r\n\r\n        popup.appendChild(preview);\r\n        popup.appendChild(hoursLabel);\r\n        popup.appendChild(hoursGrid);\r\n        popup.appendChild(minsLabel);\r\n        popup.appendChild(minsRow);\r\n        popup.appendChild(merLabel);\r\n        popup.appendChild(merRow);\r\n        popup.appendChild(actions);\r\n        return popup;\r\n      };\r\n\r\n      const attachClockPickers = () => {\r\n        document.querySelectorAll('.time-picker-btn').forEach((btn) => {\r\n          const hiddenId = btn.getAttribute('data-time-target');\r\n          const hidden = document.getElementById(hiddenId);\r\n          const initTime = (btn.getAttribute('data-init-time') || '').trim().slice(0, 5);\r\n          if (initTime) btn.textContent = fmt24to12(initTime);\r\n\r\n          const popup = buildClockPopup();\r\n          btn.parentElement.appendChild(popup);\r\n\r\n          let selHour = '12', selMin = '00', selMer = 'AM';\r\n\r\n          if (initTime) {\r\n            const [hh, mm] = initTime.split(':').map(Number);\r\n            selMer = hh >= 12 ? 'PM' : 'AM';\r\n            selHour = String((hh % 12) || 12);\r\n            selMin = String(mm).padStart(2, '0');\r\n          }\r\n\r\n          const preview = popup.querySelector('.clock-preview');\r\n          const highlight = () => {\r\n            popup.querySelectorAll('[data-group=\"hour\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selHour));\r\n            popup.querySelectorAll('[data-group=\"min\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selMin));\r\n            popup.querySelectorAll('[data-group=\"mer\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selMer));\r\n            preview.textContent = `${selHour}:${selMin} ${selMer}`;\r\n            preview.classList.add('has-selection');\r\n          };\r\n\r\n          popup.querySelectorAll('[data-group]').forEach((c) => {\r\n            c.addEventListener('click', () => {\r\n              const g = c.dataset.group;\r\n              if (g === 'hour') selHour = c.dataset.val;\r\n              if (g === 'min') selMin = c.dataset.val;\r\n              if (g === 'mer') selMer = c.dataset.val;\r\n              highlight();\r\n            });\r\n          });\r\n\r\n          highlight();\r\n\r\n          popup.querySelector('.clock-done').addEventListener('click', () => {\r\n            let h24 = parseInt(selHour, 10);\r\n            if (selMer === 'AM' && h24 === 12) h24 = 0;\r\n            if (selMer === 'PM' && h24 !== 12) h24 += 12;\r\n            const val = `${String(h24).padStart(2, '0')}:${selMin}`;\r\n            hidden.value = val;\r\n            btn.textContent = `${selHour}:${selMin} ${selMer}`;\r\n            btn.classList.add('has-value');\r\n            popup.hidden = true;\r\n          });\r\n\r\n          popup.querySelector('.clock-clear').addEventListener('click', () => {\r\n            hidden.value = '';\r\n            btn.textContent = btn.dataset.placeholder || 'Select time';\r\n            btn.classList.remove('has-value');\r\n            selHour = '12';\r\n            selMin = '00';\r\n            selMer = 'AM';\r\n            highlight();\r\n            popup.hidden = true;\r\n          });\r\n\r\n          btn.addEventListener('click', (e) => { e.stopPropagation(); popup.hidden = !popup.hidden; });\r\n          document.addEventListener('click', (e) => { if (!btn.parentElement.contains(e.target)) popup.hidden = true; });\r\n        });\r\n      };\r\n\r\n      // ── Days picker popup ─────────────────────────────────────────\r\n      const attachDaysPicker = () => {\r\n        const btn = document.getElementById('closed-days-btn');\r\n        const popup = document.getElementById('closed-days-popup');\r\n        if (!btn || !popup) return;\r\n\r\n        const syncBtn = () => {\r\n          const checked = [...popup.querySelectorAll('input[type=checkbox]:checked')].map((c) => c.value);\r\n          btn.textContent = checked.length ? checked.map((d) => d.slice(0,3)).join(', ') : 'Select closed days';\r\n          btn.classList.toggle('has-value', checked.length > 0);\r\n        };\r\n\r\n        popup.querySelectorAll('.day-chip').forEach((chip) => {\r\n          chip.addEventListener('click', () => {\r\n            const cb = chip.querySelector('input');\r\n            cb.checked = !cb.checked;\r\n            chip.classList.toggle('selected', cb.checked);\r\n            syncBtn();\r\n          });\r\n        });\r\n\r\n        popup.querySelector('.days-picker-done').addEventListener('click', () => { popup.hidden = true; });\r\n        btn.addEventListener('click', (e) => { e.stopPropagation(); popup.hidden = !popup.hidden; });\r\n        document.addEventListener('click', (e) => { if (!btn.closest('.days-picker-wrap').contains(e.target)) popup.hidden = true; });\r\n        syncBtn();\r\n      };\r\n\r\n      attachClockPickers();\r\n      attachDaysPicker();\r\n\r\n      const form = document.querySelector('form[action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/update?_method=PUT\"]');\r\n      const tagsHiddenInput = document.getElementById('tags');\r\n      const tagInput = document.getElementById('tag_input');\r\n      const tagsInputWrap = document.getElementById('tags_input_wrap');\r\n\r\n      if (!form || !tagsHiddenInput || !tagInput || !tagsInputWrap) {\r\n        return;\r\n      }\r\n\r\n      const tagsList = tagsHiddenInput.value\r\n        .split(',')\r\n        .map((tag) => tag.trim())\r\n        .filter(Boolean);\r\n\r\n      const syncTags = () => {\r\n        tagsHiddenInput.value = tagsList.join(',');\r\n      };\r\n\r\n      const removeTag = (tagValue) => {\r\n        const index = tagsList.findIndex((tag) => tag.toLowerCase() === tagValue.toLowerCase());\r\n        if (index >= 0) {\r\n          tagsList.splice(index, 1);\r\n          renderTags();\r\n        }\r\n      };\r\n\r\n      const renderTags = () => {\r\n        tagsInputWrap.querySelectorAll('.tag-chip').forEach((chip) => chip.remove());\r\n\r\n        tagsList.forEach((tag) => {\r\n          const chip = document.createElement('span');\r\n          chip.className = 'tag-chip';\r\n          chip.textContent = `#${tag}`;\r\n\r\n          const removeButton = document.createElement('button');\r\n          removeButton.type = 'button';\r\n          removeButton.className = 'tag-remove-btn';\r\n          removeButton.setAttribute('aria-label', `Remove tag ${tag}`);\r\n          removeButton.textContent = 'x';\r\n          removeButton.addEventListener('click', () => removeTag(tag));\r\n\r\n          chip.appendChild(removeButton);\r\n          tagsInputWrap.insertBefore(chip, tagInput);\r\n        });\r\n\r\n        syncTags();\r\n      };\r\n\r\n      const addTag = (rawValue) => {\r\n        rawValue\r\n          .split(',')\r\n          .map((tag) => tag.trim().replace(/^#+/, ''))\r\n          .filter(Boolean)\r\n          .forEach((tagValue) => {\r\n            if (tagsList.some((tag) => tag.toLowerCase() === tagValue.toLowerCase())) {\r\n              return;\r\n            }\r\n\r\n            tagsList.push(tagValue);\r\n          });\r\n\r\n        renderTags();\r\n      };\r\n\r\n      tagInput.addEventListener('keydown', (event) => {\r\n        if (event.key === 'Enter' || event.key === ',') {\r\n          event.preventDefault();\r\n          addTag(tagInput.value);\r\n          tagInput.value = '';\r\n        } else if (event.key === 'Backspace' && !tagInput.value && tagsList.length > 0) {\r\n          tagsList.pop();\r\n          renderTags();\r\n        }\r\n      });\r\n\r\n      tagsInputWrap.addEventListener('click', () => tagInput.focus());\r\n\r\n      const clearClientMissingState = () => {\r\n        form.querySelectorAll('.form-group--missing').forEach((group) => group.classList.remove('form-group--missing'));\r\n        form.querySelectorAll('.field--missing').forEach((field) => field.classList.remove('field--missing'));\r\n      };\r\n\r\n      const setValidationAlert = (missingLabels) => {\r\n        let alertNode = document.querySelector('.validation-alert');\r\n        if (!alertNode) {\r\n          alertNode = document.createElement('div');\r\n          alertNode.className = 'alert alert-error validation-alert';\r\n          alertNode.setAttribute('role', 'alert');\r\n          form.parentElement.insertBefore(alertNode, form);\r\n        }\r\n        alertNode.textContent = `Missing required fields: ${missingLabels.join(', ')}`;\r\n      };\r\n\r\n      const findMissingRequiredFields = () => {\r\n        const missing = [];\r\n        form.querySelectorAll('[data-required-label]').forEach((field) => {\r\n          const raw = (field.value || '').trim();\r\n          if (!raw) {\r\n            const group = field.closest('.form-group');\r\n            if (group) group.classList.add('form-group--missing');\r\n            field.classList.add('field--missing');\r\n            missing.push(field.getAttribute('data-required-label'));\r\n          }\r\n        });\r\n        return missing;\r\n      };\r\n\r\n      form.querySelectorAll('[data-required-label]').forEach((field) => {\r\n        field.addEventListener('input', () => {\r\n          if ((field.value || '').trim()) {\r\n            field.classList.remove('field--missing');\r\n            const group = field.closest('.form-group');\r\n            if (group) group.classList.remove('form-group--missing');\r\n          }\r\n        });\r\n      });\r\n\r\n      form.addEventListener('submit', (event) => {\r\n        if (tagInput.value.trim()) {\r\n          addTag(tagInput.value);\r\n          tagInput.value = '';\r\n        }\r\n\r\n        clearClientMissingState();\r\n        const missingLabels = findMissingRequiredFields();\r\n        if (missingLabels.length) {\r\n          event.preventDefault();\r\n          setValidationAlert(missingLabels);\r\n          const firstMissing = form.querySelector('.field--missing');\r\n          if (firstMissing) {\r\n            firstMissing.focus();\r\n            firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });\r\n          }\r\n        }\r\n      });\r\n\r\n      renderTags();\r\n    })();\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "places/index": function (locals, escapeFn, include, rethrow) {
var user = locals.user, category = locals.category, search = locals.search, places = locals.places, sidebar = locals.sidebar;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Recommendations - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"discussion-page container\">\r\n    <div class=\"places-header\">\r\n      <div class=\"places-header-top\">\r\n        <a href=\"/\" class=\"btn btn-secondary\">← Back to Home</a>\r\n        ")
    ;  if (user) { 
    ; __append("\r\n          <a href=\"/places/new/form\" class=\"btn btn-primary\">+ Add Recommendation</a>\r\n        ")
    ;  } 
    ; __append("\r\n      </div>\r\n\r\n      <h1>Recommendations</h1>\r\n\r\n      <div class=\"filter-section\">\r\n        <form method=\"GET\" action=\"/places\" class=\"filter-form\">\r\n          <select name=\"category\" onchange=\"this.form.submit()\">\r\n            <option value=\"\">All Categories</option>\r\n            <option value=\"Restaurant\" ")
    ;  if (category === 'Restaurant') { 
    ; __append("selected")
    ;  } 
    ; __append(">Restaurant</option>\r\n            <option value=\"Bar\" ")
    ;  if (category === 'Bar') { 
    ; __append("selected")
    ;  } 
    ; __append(">Bar</option>\r\n            <option value=\"Speakeasy\" ")
    ;  if (category === 'Speakeasy') { 
    ; __append("selected")
    ;  } 
    ; __append(">Speakeasy</option>\r\n            <option value=\"Entertainment\" ")
    ;  if (category === 'Entertainment') { 
    ; __append("selected")
    ;  } 
    ; __append(">Entertainment</option>\r\n            <option value=\"Cafe\" ")
    ;  if (category === 'Cafe') { 
    ; __append("selected")
    ;  } 
    ; __append(">Cafe</option>\r\n            <option value=\"Shop\" ")
    ;  if (category === 'Shop') { 
    ; __append("selected")
    ;  } 
    ; __append(">Shop</option>\r\n            <option value=\"Business\" ")
    ;  if (category === 'Business') { 
    ; __append("selected")
    ;  } 
    ; __append(">Business</option>\r\n            <option value=\"Tour\" ")
    ;  if (category === 'Tour') { 
    ; __append("selected")
    ;  } 
    ; __append(">Tour</option>\r\n            <option value=\"Experience\" ")
    ;  if (category === 'Experience') { 
    ; __append("selected")
    ;  } 
    ; __append(">Experience</option>\r\n            <option value=\"Grocery Store\" ")
    ;  if (category === 'Grocery Store') { 
    ; __append("selected")
    ;  } 
    ; __append(">Grocery Store</option>\r\n            <option value=\"Market\" ")
    ;  if (category === 'Market') { 
    ; __append("selected")
    ;  } 
    ; __append(">Market</option>\r\n            <option value=\"Mall\" ")
    ;  if (category === 'Mall') { 
    ; __append("selected")
    ;  } 
    ; __append(">Mall</option>\r\n            <option value=\"Library\" ")
    ;  if (category === 'Library') { 
    ; __append("selected")
    ;  } 
    ; __append(">Library</option>\r\n            <option value=\"Gym\" ")
    ;  if (category === 'Gym') { 
    ; __append("selected")
    ;  } 
    ; __append(">Gym</option>\r\n            <option value=\"Other\" ")
    ;  if (category === 'Other') { 
    ; __append("selected")
    ;  } 
    ; __append(">Other</option>\r\n          </select>\r\n\r\n          <input type=\"text\" name=\"search\" placeholder=\"Search by name, description, or tags...\" value=\"")
    ; __append(escapeFn( search ))
    ; __append("\">\r\n          <button type=\"submit\" class=\"btn btn-secondary\">Search</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"places-three-col-layout\">\r\n      ")
    ; __append( include('../partials/adventure-guide-sidebar') )
    ; __append("\r\n\r\n      <section class=\"discussion-main-column\">\r\n        ")
    ;  if (places.length > 0) { 
    ; __append("\r\n          <div class=\"places-grid\">\r\n            ")
    ;  places.forEach(place => { 
    ; __append("\r\n              <div class=\"place-card\">\r\n                ")
    ;  if (Number(place.is_coming_soon || 0) === 1) { 
    ; __append("\r\n                  <p><span class=\"badge-status badge-pending\">Coming Soon</span></p>\r\n                ")
    ;  } 
    ; __append("\r\n                <div class=\"place-header\">\r\n                  <h2><a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("\">")
    ; __append(escapeFn( place.title ))
    ; __append("</a></h2>\r\n                  <div class=\"place-card-badges\">\r\n                    <span class=\"category-badge\">")
    ; __append(escapeFn( place.category ))
    ; __append("</span>\r\n                  </div>\r\n                </div>\r\n\r\n                <p class=\"place-location\">📍 ")
    ; __append(escapeFn( place.location ))
    ; __append("</p>\r\n\r\n                ")
    ;  if (place.rating) { 
    ; __append("\r\n                  <div class=\"rating\">\r\n                    ⭐ ")
    ; __append(escapeFn( place.rating ))
    ; __append("/5.0\r\n                  </div>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                ")
    ;  if (place.hasBusinessHours) { 
    ; __append("\r\n                  <p class=\"muted-text\"><strong>Hours:</strong> ")
    ; __append(escapeFn( place.businessHoursLabel ))
    ; __append("</p>\r\n                  <p>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( place.isOpenNow ? 'badge-approved' : 'badge-draft' ))
    ; __append("\">")
    ; __append(escapeFn( place.openStatusLabel ))
    ; __append("</span>\r\n                  </p>\r\n                  ")
    ;  if (place.holidayNotice) { 
    ; __append("\r\n                    <p class=\"muted-text\">Holiday might affect these hours</p>\r\n                  ")
    ;  } 
    ; __append("\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <p class=\"place-description\">")
    ; __append(escapeFn( place.short_description ))
    ; __append("</p>\r\n\r\n                <p class=\"muted-text\"><strong>")
    ; __append(escapeFn( Number(place.like_count || 0) ))
    ; __append("</strong> likes • <strong>")
    ; __append(escapeFn( Number(place.comment_count || 0) ))
    ; __append("</strong> comments</p>\r\n                ")
    ;  if (place.employee_rating_count) { 
    ; __append("\r\n                  <p class=\"muted-text\">Employee rating: <strong>")
    ; __append(escapeFn( Number(place.employee_rating_avg || 0).toFixed(1) ))
    ; __append("/5</strong> (")
    ; __append(escapeFn( Number(place.employee_rating_count || 0) ))
    ; __append(")</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                ")
    ;  if (place.tags) { 
    ; __append("\r\n                  <div class=\"place-tags\">\r\n                    ")
    ;  place.tags.split(',').map(t => t.trim()).filter(t => t).forEach(tag => { 
    ; __append("\r\n                      <span class=\"tag-pill\">")
    ; __append(escapeFn( tag ))
    ; __append("</span>\r\n                    ")
    ;  }) 
    ; __append("\r\n                  </div>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <div class=\"place-actions\">\r\n                  <a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("\" class=\"btn btn-primary\">View Details</a>\r\n                </div>\r\n              </div>\r\n            ")
    ;  }); 
    ; __append("\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"empty-state\">\r\n            <p>No recommendations found. ")
    ;  if (user) { 
    ; __append("<a href=\"/places/new/form\">Add the first recommendation!</a>")
    ;  } 
    ; __append("</p>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n\r\n      <aside class=\"discussion-sidebar\">\r\n        <div class=\"discussion-sidebar-card\">\r\n          <div class=\"discussion-sidebar-tablist\" role=\"tablist\" aria-label=\"Recommendations sidebar views\">\r\n            <button type=\"button\" class=\"discussion-sidebar-tab active\" data-rec-tab=\"trending-hot\" role=\"tab\" aria-selected=\"true\">Trending/Hot</button>\r\n            <button type=\"button\" class=\"discussion-sidebar-tab\" data-rec-tab=\"top-rated\" role=\"tab\" aria-selected=\"false\">Top Rated</button>\r\n            <button type=\"button\" class=\"discussion-sidebar-tab\" data-rec-tab=\"most-liked\" role=\"tab\" aria-selected=\"false\">Most Liked</button>\r\n          </div>\r\n\r\n          <section class=\"discussion-sidebar-panel active\" data-rec-panel=\"trending-hot\" role=\"tabpanel\">\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>Trending/Hot</h3>\r\n            </div>\r\n            ")
    ;  if (sidebar && sidebar.trendingHot && sidebar.trendingHot.length > 0) { 
    ; __append("\r\n              <div class=\"discussion-sidebar-list\">\r\n                ")
    ;  sidebar.trendingHot.forEach(item => { 
    ; __append("\r\n                  <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                    <div>\r\n                      <strong>")
    ; __append(escapeFn( item.title ))
    ; __append("</strong>\r\n                      <p>")
    ; __append(escapeFn( item.category ))
    ; __append(" • ")
    ; __append(escapeFn( item.likeCount ))
    ; __append(" likes • ")
    ; __append(escapeFn( item.commentCount ))
    ; __append(" comments</p>\r\n                    </div>\r\n                    <div class=\"discussion-sidebar-item-badges\">\r\n                      <span class=\"badge-status badge-city-soft\">Hot Score: ")
    ; __append(escapeFn( item.hotScore ))
    ; __append("</span>\r\n                    </div>\r\n                  </a>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">No trending recommendations yet.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n\r\n          <section class=\"discussion-sidebar-panel\" data-rec-panel=\"top-rated\" role=\"tabpanel\" hidden>\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>Top Rated</h3>\r\n            </div>\r\n            ")
    ;  if (sidebar && sidebar.topRated && sidebar.topRated.length > 0) { 
    ; __append("\r\n              <div class=\"discussion-sidebar-list\">\r\n                ")
    ;  sidebar.topRated.forEach(item => { 
    ; __append("\r\n                  <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                    <div>\r\n                      <strong>")
    ; __append(escapeFn( item.title ))
    ; __append("</strong>\r\n                      <p>")
    ; __append(escapeFn( item.category ))
    ; __append(" • ")
    ; __append(escapeFn( item.avgRating.toFixed(1) ))
    ; __append("/5</p>\r\n                    </div>\r\n                    <div class=\"discussion-sidebar-item-badges\">\r\n                      <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( item.ratingCount ))
    ; __append(" ratings</span>\r\n                    </div>\r\n                  </a>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">No employee ratings yet.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n\r\n          <section class=\"discussion-sidebar-panel\" data-rec-panel=\"most-liked\" role=\"tabpanel\" hidden>\r\n            <div class=\"discussion-sidebar-panel-head\">\r\n              <h3>Most Liked</h3>\r\n            </div>\r\n            ")
    ;  if (sidebar && sidebar.mostLiked && sidebar.mostLiked.length > 0) { 
    ; __append("\r\n              <div class=\"discussion-sidebar-list\">\r\n                ")
    ;  sidebar.mostLiked.forEach(item => { 
    ; __append("\r\n                  <a href=\"")
    ; __append(escapeFn( item.href ))
    ; __append("\" class=\"discussion-sidebar-item\">\r\n                    <div>\r\n                      <strong>")
    ; __append(escapeFn( item.title ))
    ; __append("</strong>\r\n                      <p>")
    ; __append(escapeFn( item.category ))
    ; __append("</p>\r\n                    </div>\r\n                    <div class=\"discussion-sidebar-item-badges\">\r\n                      <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( item.likeCount ))
    ; __append(" likes</span>\r\n                    </div>\r\n                  </a>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n            ")
    ;  } else { 
    ; __append("\r\n              <p class=\"muted-text\">No likes yet.</p>\r\n            ")
    ;  } 
    ; __append("\r\n          </section>\r\n        </div>\r\n      </aside>\r\n    </div>\r\n  </main>\r\n\r\n  <script>\r\n    (() => {\r\n      const activateTab = (tabName) => {\r\n        document.querySelectorAll('[data-rec-tab]').forEach((button) => {\r\n          const isActive = button.getAttribute('data-rec-tab') === tabName;\r\n          button.classList.toggle('active', isActive);\r\n          button.setAttribute('aria-selected', String(isActive));\r\n        });\r\n\r\n        document.querySelectorAll('[data-rec-panel]').forEach((panel) => {\r\n          const isActive = panel.getAttribute('data-rec-panel') === tabName;\r\n          panel.classList.toggle('active', isActive);\r\n          panel.hidden = !isActive;\r\n        });\r\n      };\r\n\r\n      document.querySelectorAll('[data-rec-tab]').forEach((button) => {\r\n        button.addEventListener('click', () => activateTab(button.getAttribute('data-rec-tab')));\r\n      });\r\n    })();\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "places/my-recommendations": function (locals, escapeFn, include, rethrow) {
var city = locals.city, message = locals.message, groupedPlaces = locals.groupedPlaces, activeTab = locals.activeTab, formatDate = locals.formatDate;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>My Recommendations - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container queue-page\">\r\n    <div class=\"queue-page-header\">\r\n      <div>\r\n        <h1>My Recommendations</h1>\r\n        <p class=\"queue-page-intro\">Review everything you have uploaded in <strong>")
    ; __append(escapeFn( city ))
    ; __append("</strong>, including live recommendations and drafts.</p>\r\n      </div>\r\n      <div class=\"queue-card-actions\" style=\"margin-top: 0;\">\r\n        <a href=\"/places/new/form\" class=\"btn btn-primary\">Add Recommendation</a>\r\n        <a href=\"/places\" class=\"btn btn-secondary\">Browse All</a>\r\n      </div>\r\n    </div>\r\n\r\n    ")
    ;  if (message) { 
    ; __append("\r\n      <div class=\"alert alert-success\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  const tabConfig = [
      { key: 'all', label: 'All', items: groupedPlaces?.all || [] },
      { key: 'published', label: 'Published', items: groupedPlaces?.published || [] },
      { key: 'drafts', label: 'Drafts', items: groupedPlaces?.drafts || [] }
    ]; 
    ; __append("\r\n\r\n    <div class=\"queue-sidebar-layout\">\r\n      <aside class=\"queue-sidebar\" aria-label=\"My recommendations sections\">\r\n        <div class=\"queue-sidebar-tablist\" role=\"tablist\" aria-label=\"Recommendation filters\">\r\n          ")
    ;  tabConfig.forEach((section) => { 
    ; __append("\r\n            <a\r\n              href=\"/places/my-recommendations?tab=")
    ; __append(escapeFn( section.key ))
    ; __append("\"\r\n              class=\"queue-sidebar-tab ")
    ; __append(escapeFn( activeTab === section.key ? 'active' : '' ))
    ; __append("\"\r\n            >\r\n              <span>")
    ; __append(escapeFn( section.label ))
    ; __append("</span>\r\n              <strong>")
    ; __append(escapeFn( section.items.length ))
    ; __append("</strong>\r\n            </a>\r\n          ")
    ;  }) 
    ; __append("\r\n        </div>\r\n      </aside>\r\n\r\n      <div class=\"queue-sidebar-panels\">\r\n        ")
    ;  const activeSection = tabConfig.find((section) => section.key === activeTab) || tabConfig[0]; 
    ; __append("\r\n        <section class=\"queue-sidebar-panel active\" role=\"tabpanel\">\r\n          <div class=\"queue-section-header\">\r\n            <div>\r\n              <h2>")
    ; __append(escapeFn( activeSection.label ))
    ; __append("</h2>\r\n              <p class=\"muted-text\">\r\n                ")
    ;  if (activeSection.key === 'drafts') { 
    ; __append("\r\n                  Drafts stay private until you publish them.\r\n                ")
    ;  } else if (activeSection.key === 'published') { 
    ; __append("\r\n                  These recommendations are currently live.\r\n                ")
    ;  } else { 
    ; __append("\r\n                  This view includes both live recommendations and drafts.\r\n                ")
    ;  } 
    ; __append("\r\n              </p>\r\n            </div>\r\n          </div>\r\n\r\n          ")
    ;  if (activeSection.items.length) { 
    ; __append("\r\n            <div class=\"queue-list\">\r\n              ")
    ;  activeSection.items.forEach((place) => { 
    ; __append("\r\n                ")
    ;  const isDraft = place.approval_status === 'draft'; 
    ; __append("\r\n                <article class=\"queue-card\">\r\n                  ")
    ;  if (Number(place.is_coming_soon || 0) === 1) { 
    ; __append("\r\n                    <p><span class=\"badge-status badge-pending\">Coming Soon</span></p>\r\n                  ")
    ;  } 
    ; __append("\r\n                  <div class=\"queue-card-head\">\r\n                    <div>\r\n                      <h3><a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("\">")
    ; __append(escapeFn( place.title ))
    ; __append("</a></h3>\r\n                      <div class=\"queue-card-meta\">\r\n                        <span><strong>Category:</strong> ")
    ; __append(escapeFn( place.category ))
    ; __append("</span>\r\n                        <span><strong>Location:</strong> ")
    ; __append(escapeFn( place.location ))
    ; __append("</span>\r\n                        <span><strong>Updated:</strong> ")
    ; __append(escapeFn( formatDate(place.updated_at || place.created_at) ))
    ; __append("</span>\r\n                      </div>\r\n                    </div>\r\n                    <span class=\"badge-status ")
    ; __append(escapeFn( isDraft ? 'badge-draft' : 'badge-approved' ))
    ; __append("\">")
    ; __append(escapeFn( isDraft ? 'draft' : 'live' ))
    ; __append("</span>\r\n                  </div>\r\n\r\n                  ")
    ;  if (place.short_description) { 
    ; __append("\r\n                    <p class=\"muted-text\">")
    ; __append(escapeFn( place.short_description ))
    ; __append("</p>\r\n                  ")
    ;  } 
    ; __append("\r\n\r\n                  ")
    ;  if (place.hasBusinessHours) { 
    ; __append("\r\n                    <p class=\"muted-text\"><strong>Hours:</strong> ")
    ; __append(escapeFn( place.businessHoursLabel ))
    ; __append("</p>\r\n                    <p><span class=\"badge-status ")
    ; __append(escapeFn( place.isOpenNow ? 'badge-approved' : 'badge-draft' ))
    ; __append("\">")
    ; __append(escapeFn( place.openStatusLabel ))
    ; __append("</span></p>\r\n                    ")
    ;  if (place.holidayNotice) { 
    ; __append("\r\n                      <p class=\"muted-text\">Holiday might affect these hours</p>\r\n                    ")
    ;  } 
    ; __append("\r\n                  ")
    ;  } 
    ; __append("\r\n\r\n                  <div class=\"queue-card-actions\">\r\n                    <a href=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("\" class=\"btn btn-secondary\">View</a>\r\n                    ")
    ;  if (isDraft) { 
    ; __append("\r\n                      <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/publish\" class=\"queue-inline-form\">\r\n                        <button type=\"submit\" class=\"btn btn-secondary\">Publish</button>\r\n                      </form>\r\n                    ")
    ;  } else { 
    ; __append("\r\n                      <form method=\"POST\" action=\"/places/")
    ; __append(escapeFn( place.id ))
    ; __append("/draft\" class=\"queue-inline-form\">\r\n                        <button type=\"submit\" class=\"btn btn-secondary\">Move To Drafts</button>\r\n                      </form>\r\n                    ")
    ;  } 
    ; __append("\r\n                  </div>\r\n                </article>\r\n              ")
    ;  }) 
    ; __append("\r\n            </div>\r\n          ")
    ;  } else { 
    ; __append("\r\n            <div class=\"queue-section-empty\">\r\n              <p>\r\n                ")
    ;  if (activeSection.key === 'drafts') { 
    ; __append("\r\n                  You do not have any drafts right now.\r\n                ")
    ;  } else if (activeSection.key === 'published') { 
    ; __append("\r\n                  You have not published any recommendations yet.\r\n                ")
    ;  } else { 
    ; __append("\r\n                  You have not added any recommendations yet.\r\n                ")
    ;  } 
    ; __append("\r\n              </p>\r\n              <a href=\"/places/new/form\" class=\"btn btn-primary\">Add Recommendation</a>\r\n            </div>\r\n          ")
    ;  } 
    ; __append("\r\n        </section>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

},
  "places/new": function (locals, escapeFn, include, rethrow) {
var missingFields = locals.missingFields, message = locals.message, draftPlace = locals.draftPlace;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Add New Recommendation - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main class=\"container\">\r\n    <div class=\"form-container\">\r\n      <h1>Add New Recommendation</h1>\r\n      <p class=\"queue-page-intro\">New recommendations are published immediately and can be updated any time.</p>\r\n      ")
    ;  const missingFieldValues = (typeof missingFields !== 'undefined' && Array.isArray(missingFields)) ? missingFields : []; 
    ; __append("\r\n      ")
    ;  const missingFieldSet = new Set(missingFieldValues); 
    ; __append("\r\n      \r\n      ")
    ;  if (typeof message !== 'undefined') { 
    ; __append("\r\n        <div class=\"alert alert-error\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      ")
    ;  if (missingFieldSet.size > 0) { 
    ; __append("\r\n        <div class=\"alert alert-error validation-alert\" role=\"alert\">\r\n          Missing required fields: ")
    ; __append(escapeFn( Array.from(missingFieldSet).map((field) => {
            const labelMap = {
              title: 'Place Name',
              category: 'Category',
              detailed_description: 'Detailed Description',
              location: 'Location/Area'
            };
            return labelMap[field] || field;
          }).join(', ') ))
    ; __append("\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <form method=\"POST\" action=\"/places/new/create\">\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('title') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"title\">Place Name *</label>\r\n          <input type=\"text\" id=\"title\" name=\"title\" value=\"")
    ; __append(escapeFn( draftPlace?.title || '' ))
    ; __append("\" data-required-label=\"Place Name\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('title') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('category') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"category\">Category *</label>\r\n          <select id=\"category\" name=\"category\" data-required-label=\"Category\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('category') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n            <option value=\"\">Select a category</option>\r\n            <option value=\"Restaurant\" ")
    ;  if (draftPlace?.category === 'Restaurant') { 
    ; __append("selected")
    ;  } 
    ; __append(">Restaurant</option>\r\n            <option value=\"Bar\" ")
    ;  if (draftPlace?.category === 'Bar') { 
    ; __append("selected")
    ;  } 
    ; __append(">Bar</option>\r\n            <option value=\"Speakeasy\" ")
    ;  if (draftPlace?.category === 'Speakeasy') { 
    ; __append("selected")
    ;  } 
    ; __append(">Speakeasy</option>\r\n            <option value=\"Entertainment\" ")
    ;  if (draftPlace?.category === 'Entertainment') { 
    ; __append("selected")
    ;  } 
    ; __append(">Entertainment</option>\r\n            <option value=\"Cafe\" ")
    ;  if (draftPlace?.category === 'Cafe') { 
    ; __append("selected")
    ;  } 
    ; __append(">Cafe</option>\r\n            <option value=\"Shop\" ")
    ;  if (draftPlace?.category === 'Shop') { 
    ; __append("selected")
    ;  } 
    ; __append(">Shop</option>\r\n            <option value=\"Business\" ")
    ;  if (draftPlace?.category === 'Business') { 
    ; __append("selected")
    ;  } 
    ; __append(">Business</option>\r\n            <option value=\"Tour\" ")
    ;  if (draftPlace?.category === 'Tour') { 
    ; __append("selected")
    ;  } 
    ; __append(">Tour</option>\r\n            <option value=\"Experience\" ")
    ;  if (draftPlace?.category === 'Experience') { 
    ; __append("selected")
    ;  } 
    ; __append(">Experience</option>\r\n            <option value=\"Grocery Store\" ")
    ;  if (draftPlace?.category === 'Grocery Store') { 
    ; __append("selected")
    ;  } 
    ; __append(">Grocery Store</option>\r\n            <option value=\"Market\" ")
    ;  if (draftPlace?.category === 'Market') { 
    ; __append("selected")
    ;  } 
    ; __append(">Market</option>\r\n            <option value=\"Mall\" ")
    ;  if (draftPlace?.category === 'Mall') { 
    ; __append("selected")
    ;  } 
    ; __append(">Mall</option>\r\n            <option value=\"Library\" ")
    ;  if (draftPlace?.category === 'Library') { 
    ; __append("selected")
    ;  } 
    ; __append(">Library</option>\r\n            <option value=\"Gym\" ")
    ;  if (draftPlace?.category === 'Gym') { 
    ; __append("selected")
    ;  } 
    ; __append(">Gym</option>\r\n            <option value=\"Other\" ")
    ;  if (draftPlace?.category === 'Other') { 
    ; __append("selected")
    ;  } 
    ; __append(">Other</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"short_description\">Short Description</label>\r\n          <input type=\"text\" id=\"short_description\" name=\"short_description\" value=\"")
    ; __append(escapeFn( draftPlace?.short_description || '' ))
    ; __append("\" placeholder=\"Brief one-liner\">\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('detailed_description') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"detailed_description\">Detailed Description *</label>\r\n          <textarea id=\"detailed_description\" name=\"detailed_description\" rows=\"6\" data-required-label=\"Detailed Description\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('detailed_description') ? 'field--missing' : '' ))
    ; __append("\" required>")
    ; __append(escapeFn( draftPlace?.detailed_description || '' ))
    ; __append("</textarea>\r\n        </div>\r\n\r\n        <div class=\"form-group ")
    ; __append(escapeFn( missingFieldSet.has('location') ? 'form-group--missing' : '' ))
    ; __append("\">\r\n          <label for=\"location\">Location/Area *</label>\r\n          <input type=\"text\" id=\"location\" name=\"location\" value=\"")
    ; __append(escapeFn( draftPlace?.location || '' ))
    ; __append("\" data-required-label=\"Location/Area\" class=\"")
    ; __append(escapeFn( missingFieldSet.has('location') ? 'field--missing' : '' ))
    ; __append("\" required>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"address\">Address</label>\r\n          <input type=\"text\" id=\"address\" name=\"address\" value=\"")
    ; __append(escapeFn( draftPlace?.address || '' ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"phone\">Phone Number</label>\r\n          <input type=\"tel\" id=\"phone\" name=\"phone\" value=\"")
    ; __append(escapeFn( draftPlace?.phone || '' ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"website\">Website</label>\r\n          <input type=\"text\" id=\"website\" name=\"website\" value=\"")
    ; __append(escapeFn( draftPlace?.website || '' ))
    ; __append("\" placeholder=\"Optional website\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>Opening Time</label>\r\n          <div class=\"time-picker-wrap\">\r\n            <button type=\"button\" class=\"time-picker-btn\" data-time-target=\"opening_time\" data-init-time=\"")
    ; __append(escapeFn( draftPlace?.opening_time || '' ))
    ; __append("\">Select opening time</button>\r\n            <input type=\"hidden\" id=\"opening_time\" name=\"opening_time\" value=\"")
    ; __append(escapeFn( draftPlace?.opening_time || '' ))
    ; __append("\">\r\n          </div>\r\n          <small class=\"form-hint\">Use local property time.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>Closing Time</label>\r\n          <div class=\"time-picker-wrap\">\r\n            <button type=\"button\" class=\"time-picker-btn\" data-time-target=\"closing_time\" data-init-time=\"")
    ; __append(escapeFn( draftPlace?.closing_time || '' ))
    ; __append("\">Select closing time</button>\r\n            <input type=\"hidden\" id=\"closing_time\" name=\"closing_time\" value=\"")
    ; __append(escapeFn( draftPlace?.closing_time || '' ))
    ; __append("\">\r\n          </div>\r\n          <small class=\"form-hint\">If closing after midnight, set the next-day closing time.</small>\r\n        </div>\r\n\r\n        ")
    ;  const allWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
    ; __append("\r\n        ")
    ;  const selectedClosedDays = Array.isArray(draftPlace?.closed_days)
          ? draftPlace.closed_days
          : (draftPlace?.closed_days ? String(draftPlace.closed_days).split(',').map((day) => day.trim()).filter(Boolean) : []); 
    ; __append("\r\n        <div class=\"form-group\">\r\n          <label>Closed Days</label>\r\n          <div class=\"days-picker-wrap\">\r\n            <button type=\"button\" class=\"days-picker-btn\" id=\"closed-days-btn\">Select closed days</button>\r\n            <div class=\"days-picker-popup\" id=\"closed-days-popup\" hidden>\r\n              <div class=\"days-picker-grid\">\r\n                ")
    ;  allWeekdays.forEach((day) => { 
    ; __append("\r\n                  <label class=\"day-chip ")
    ; __append(escapeFn( selectedClosedDays.includes(day) ? 'selected' : '' ))
    ; __append("\">\r\n                    <input type=\"checkbox\" name=\"closed_days\" value=\"")
    ; __append(escapeFn( day ))
    ; __append("\" ")
    ; __append(escapeFn( selectedClosedDays.includes(day) ? 'checked' : '' ))
    ; __append(" hidden>\r\n                    ")
    ; __append(escapeFn( day.slice(0, 3) ))
    ; __append("\r\n                  </label>\r\n                ")
    ;  }) 
    ; __append("\r\n              </div>\r\n              <button type=\"button\" class=\"days-picker-done\">Done</button>\r\n            </div>\r\n          </div>\r\n          <small class=\"form-hint\">Select days when this place may be closed.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>\r\n            <input type=\"checkbox\" name=\"is_coming_soon\" value=\"1\" ")
    ; __append(escapeFn( draftPlace?.is_coming_soon === '1' ? 'checked' : '' ))
    ; __append(">\r\n            Mark as Coming Soon\r\n          </label>\r\n          <small class=\"form-hint\">Use this for places not yet open to guests.</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"walking_directions\">Walking Directions</label>\r\n          <textarea id=\"walking_directions\" name=\"walking_directions\" rows=\"4\" placeholder=\"Example: Exit the hotel lobby, turn right on Main St, and walk two blocks.\">")
    ; __append(escapeFn( draftPlace?.walking_directions || '' ))
    ; __append("</textarea>\r\n          <small class=\"form-hint\">Short walking directions guests can follow from the property or nearby landmark</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"google_maps_link\">Google Maps Link</label>\r\n          <input type=\"url\" id=\"google_maps_link\" name=\"google_maps_link\" value=\"")
    ; __append(escapeFn( draftPlace?.google_maps_link || '' ))
    ; __append("\" placeholder=\"https://maps.google.com/...\">\r\n          <small class=\"form-hint\">Optional direct map or walking route link</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"transit_lines\">Bus and Train Lines</label>\r\n          <input type=\"text\" id=\"transit_lines\" name=\"transit_lines\" value=\"")
    ; __append(escapeFn( draftPlace?.transit_lines || '' ))
    ; __append("\" placeholder=\"Example: Bus 3, Bus 801, Red Line\">\r\n          <small class=\"form-hint\">List the nearest bus routes, train lines, or transit stops guests can use</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"reservation_link\">Reservation Link</label>\r\n          <input type=\"url\" id=\"reservation_link\" name=\"reservation_link\" value=\"")
    ; __append(escapeFn( draftPlace?.reservation_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Direct URL where guests can make a reservation</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"menu_link\">Menu Link</label>\r\n          <input type=\"url\" id=\"menu_link\" name=\"menu_link\" value=\"")
    ; __append(escapeFn( draftPlace?.menu_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Optional URL to the venue's food or drink menu</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"events_link\">Events Link</label>\r\n          <input type=\"url\" id=\"events_link\" name=\"events_link\" value=\"")
    ; __append(escapeFn( draftPlace?.events_link || '' ))
    ; __append("\" placeholder=\"https://...\">\r\n          <small class=\"form-hint\">Optional URL to the venue's events or bookings page</small>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"rating\">Rating (1-5)</label>\r\n          <input type=\"number\" id=\"rating\" name=\"rating\" min=\"1\" max=\"5\" step=\"0.1\" value=\"")
    ; __append(escapeFn( draftPlace?.rating || '' ))
    ; __append("\">\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"tag_input\">Tags</label>\r\n          <div class=\"tags-input-wrap\" id=\"tags_input_wrap\">\r\n            <input\r\n              type=\"text\"\r\n              id=\"tag_input\"\r\n              class=\"tag-entry-input\"\r\n              placeholder=\"Type a tag and press Enter\"\r\n              autocomplete=\"off\"\r\n            >\r\n          </div>\r\n          <input type=\"hidden\" id=\"tags\" name=\"tags\" value=\"")
    ; __append(escapeFn( draftPlace?.tags || '' ))
    ; __append("\">\r\n          <small class=\"form-hint\">Press Enter to add each tag before submitting.</small>\r\n        </div>\r\n\r\n        <div class=\"form-actions\">\r\n          <button type=\"submit\" name=\"submit_action\" value=\"publish\" class=\"btn btn-primary\">Publish Recommendation</button>\r\n          <button type=\"submit\" name=\"submit_action\" value=\"draft\" class=\"btn btn-secondary\">Save As Draft</button>\r\n          <a href=\"/places/my-recommendations\" class=\"btn btn-secondary\">Cancel</a>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </main>\r\n\r\n  <script>\r\n    (() => {\r\n      // ── Clock popup ──────────────────────────────────────────────\r\n      const fmt24to12 = (val) => {\r\n        if (!val) return '';\r\n        const [hStr, mStr] = val.split(':');\r\n        const h = parseInt(hStr, 10);\r\n        const m = parseInt(mStr, 10);\r\n        const mer = h >= 12 ? 'PM' : 'AM';\r\n        const dh = (h % 12) || 12;\r\n        return `${dh}:${String(m).padStart(2, '0')} ${mer}`;\r\n      };\r\n\r\n      const buildClockPopup = () => {\r\n        const popup = document.createElement('div');\r\n        popup.className = 'clock-popup';\r\n        popup.hidden = true;\r\n\r\n        // preview bar\r\n        const preview = document.createElement('div');\r\n        preview.className = 'clock-preview';\r\n        preview.textContent = '--:-- --';\r\n\r\n        // hours section\r\n        const hoursLabel = document.createElement('div');\r\n        hoursLabel.className = 'clock-section-label';\r\n        hoursLabel.textContent = 'Hour';\r\n        const hoursGrid = document.createElement('div');\r\n        hoursGrid.className = 'clock-hours-grid';\r\n        for (let h = 1; h <= 12; h++) {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'hour'; b.dataset.val = String(h); b.textContent = h;\r\n          hoursGrid.appendChild(b);\r\n        }\r\n\r\n        // minutes section\r\n        const minsLabel = document.createElement('div');\r\n        minsLabel.className = 'clock-section-label';\r\n        minsLabel.textContent = 'Minute';\r\n        const minsRow = document.createElement('div');\r\n        minsRow.className = 'clock-mins-row';\r\n        [0, 15, 30, 45].forEach((m) => {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'min';\r\n          b.dataset.val = String(m).padStart(2, '0');\r\n          b.textContent = `:${String(m).padStart(2, '0')}`;\r\n          minsRow.appendChild(b);\r\n        });\r\n\r\n        // meridiem section\r\n        const merLabel = document.createElement('div');\r\n        merLabel.className = 'clock-section-label';\r\n        merLabel.textContent = 'Period';\r\n        const merRow = document.createElement('div');\r\n        merRow.className = 'clock-mer-row';\r\n        ['AM', 'PM'].forEach((mer) => {\r\n          const b = document.createElement('button');\r\n          b.type = 'button'; b.className = 'clock-cell'; b.dataset.group = 'mer'; b.dataset.val = mer; b.textContent = mer;\r\n          merRow.appendChild(b);\r\n        });\r\n\r\n        // action buttons\r\n        const actions = document.createElement('div');\r\n        actions.className = 'clock-actions';\r\n        const doneBtn = document.createElement('button');\r\n        doneBtn.type = 'button'; doneBtn.className = 'clock-done'; doneBtn.textContent = 'Set Time';\r\n        const clearBtn = document.createElement('button');\r\n        clearBtn.type = 'button'; clearBtn.className = 'clock-clear'; clearBtn.textContent = 'Clear';\r\n        actions.appendChild(doneBtn);\r\n        actions.appendChild(clearBtn);\r\n\r\n        popup.appendChild(preview);\r\n        popup.appendChild(hoursLabel);\r\n        popup.appendChild(hoursGrid);\r\n        popup.appendChild(minsLabel);\r\n        popup.appendChild(minsRow);\r\n        popup.appendChild(merLabel);\r\n        popup.appendChild(merRow);\r\n        popup.appendChild(actions);\r\n        return popup;\r\n      };\r\n\r\n      const attachClockPickers = () => {\r\n        document.querySelectorAll('.time-picker-btn').forEach((btn) => {\r\n          const hiddenId = btn.getAttribute('data-time-target');\r\n          const hidden = document.getElementById(hiddenId);\r\n          const initTime = (btn.getAttribute('data-init-time') || '').trim().slice(0, 5);\r\n          if (initTime) btn.textContent = fmt24to12(initTime);\r\n\r\n          const popup = buildClockPopup();\r\n          btn.parentElement.appendChild(popup);\r\n\r\n          let selHour = '12', selMin = '00', selMer = 'AM';\r\n\r\n          if (initTime) {\r\n            const [hh, mm] = initTime.split(':').map(Number);\r\n            selMer = hh >= 12 ? 'PM' : 'AM';\r\n            selHour = String((hh % 12) || 12);\r\n            selMin = String(mm).padStart(2, '0');\r\n          }\r\n\r\n          const preview = popup.querySelector('.clock-preview');\r\n          const highlight = () => {\r\n            popup.querySelectorAll('[data-group=\"hour\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selHour));\r\n            popup.querySelectorAll('[data-group=\"min\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selMin));\r\n            popup.querySelectorAll('[data-group=\"mer\"]').forEach((c) => c.classList.toggle('active', c.dataset.val === selMer));\r\n            preview.textContent = `${selHour}:${selMin} ${selMer}`;\r\n            preview.classList.add('has-selection');\r\n          };\r\n\r\n          popup.querySelectorAll('[data-group]').forEach((c) => {\r\n            c.addEventListener('click', () => {\r\n              const g = c.dataset.group;\r\n              if (g === 'hour') selHour = c.dataset.val;\r\n              if (g === 'min') selMin = c.dataset.val;\r\n              if (g === 'mer') selMer = c.dataset.val;\r\n              highlight();\r\n            });\r\n          });\r\n\r\n          highlight();\r\n\r\n          popup.querySelector('.clock-done').addEventListener('click', () => {\r\n            let h24 = parseInt(selHour, 10);\r\n            if (selMer === 'AM' && h24 === 12) h24 = 0;\r\n            if (selMer === 'PM' && h24 !== 12) h24 += 12;\r\n            const val = `${String(h24).padStart(2, '0')}:${selMin}`;\r\n            hidden.value = val;\r\n            btn.textContent = `${selHour}:${selMin} ${selMer}`;\r\n            btn.classList.add('has-value');\r\n            popup.hidden = true;\r\n          });\r\n\r\n          popup.querySelector('.clock-clear').addEventListener('click', () => {\r\n            hidden.value = '';\r\n            btn.textContent = btn.dataset.placeholder || 'Select time';\r\n            btn.classList.remove('has-value');\r\n            selHour = '12';\r\n            selMin = '00';\r\n            selMer = 'AM';\r\n            highlight();\r\n            popup.hidden = true;\r\n          });\r\n\r\n          btn.addEventListener('click', (e) => { e.stopPropagation(); popup.hidden = !popup.hidden; });\r\n          document.addEventListener('click', (e) => { if (!btn.parentElement.contains(e.target)) popup.hidden = true; });\r\n        });\r\n      };\r\n\r\n      // ── Days picker popup ─────────────────────────────────────────\r\n      const attachDaysPicker = () => {\r\n        const btn = document.getElementById('closed-days-btn');\r\n        const popup = document.getElementById('closed-days-popup');\r\n        if (!btn || !popup) return;\r\n\r\n        const syncBtn = () => {\r\n          const checked = [...popup.querySelectorAll('input[type=checkbox]:checked')].map((c) => c.value);\r\n          btn.textContent = checked.length ? checked.map((d) => d.slice(0,3)).join(', ') : 'Select closed days';\r\n          btn.classList.toggle('has-value', checked.length > 0);\r\n        };\r\n\r\n        popup.querySelectorAll('.day-chip').forEach((chip) => {\r\n          chip.addEventListener('click', () => {\r\n            const cb = chip.querySelector('input');\r\n            cb.checked = !cb.checked;\r\n            chip.classList.toggle('selected', cb.checked);\r\n            syncBtn();\r\n          });\r\n        });\r\n\r\n        popup.querySelector('.days-picker-done').addEventListener('click', () => { popup.hidden = true; });\r\n        btn.addEventListener('click', (e) => { e.stopPropagation(); popup.hidden = !popup.hidden; });\r\n        document.addEventListener('click', (e) => { if (!btn.closest('.days-picker-wrap').contains(e.target)) popup.hidden = true; });\r\n        syncBtn();\r\n      };\r\n\r\n      attachClockPickers();\r\n      attachDaysPicker();\r\n\r\n      const form = document.querySelector('form[action=\"/places/new/create\"]');\r\n      const tagsHiddenInput = document.getElementById('tags');\r\n      const tagInput = document.getElementById('tag_input');\r\n      const tagsInputWrap = document.getElementById('tags_input_wrap');\r\n\r\n      if (!form || !tagsHiddenInput || !tagInput || !tagsInputWrap) {\r\n        return;\r\n      }\r\n\r\n      const tagsList = tagsHiddenInput.value\r\n        .split(',')\r\n        .map((tag) => tag.trim())\r\n        .filter(Boolean);\r\n\r\n      const syncTags = () => {\r\n        tagsHiddenInput.value = tagsList.join(',');\r\n      };\r\n\r\n      const removeTag = (tagValue) => {\r\n        const index = tagsList.findIndex((tag) => tag.toLowerCase() === tagValue.toLowerCase());\r\n        if (index >= 0) {\r\n          tagsList.splice(index, 1);\r\n          renderTags();\r\n        }\r\n      };\r\n\r\n      const renderTags = () => {\r\n        tagsInputWrap.querySelectorAll('.tag-chip').forEach((chip) => chip.remove());\r\n\r\n        tagsList.forEach((tag) => {\r\n          const chip = document.createElement('span');\r\n          chip.className = 'tag-chip';\r\n          chip.textContent = `#${tag}`;\r\n\r\n          const removeButton = document.createElement('button');\r\n          removeButton.type = 'button';\r\n          removeButton.className = 'tag-remove-btn';\r\n          removeButton.setAttribute('aria-label', `Remove tag ${tag}`);\r\n          removeButton.textContent = 'x';\r\n          removeButton.addEventListener('click', () => removeTag(tag));\r\n\r\n          chip.appendChild(removeButton);\r\n          tagsInputWrap.insertBefore(chip, tagInput);\r\n        });\r\n\r\n        syncTags();\r\n      };\r\n\r\n      const addTag = (rawValue) => {\r\n        rawValue\r\n          .split(',')\r\n          .map((tag) => tag.trim().replace(/^#+/, ''))\r\n          .filter(Boolean)\r\n          .forEach((tagValue) => {\r\n            if (tagsList.some((tag) => tag.toLowerCase() === tagValue.toLowerCase())) {\r\n              return;\r\n            }\r\n\r\n            tagsList.push(tagValue);\r\n          });\r\n\r\n        renderTags();\r\n      };\r\n\r\n      tagInput.addEventListener('keydown', (event) => {\r\n        if (event.key === 'Enter' || event.key === ',') {\r\n          event.preventDefault();\r\n          addTag(tagInput.value);\r\n          tagInput.value = '';\r\n        } else if (event.key === 'Backspace' && !tagInput.value && tagsList.length > 0) {\r\n          tagsList.pop();\r\n          renderTags();\r\n        }\r\n      });\r\n\r\n      tagsInputWrap.addEventListener('click', () => tagInput.focus());\r\n\r\n      const clearClientMissingState = () => {\r\n        form.querySelectorAll('.form-group--missing').forEach((group) => group.classList.remove('form-group--missing'));\r\n        form.querySelectorAll('.field--missing').forEach((field) => field.classList.remove('field--missing'));\r\n      };\r\n\r\n      const setValidationAlert = (missingLabels) => {\r\n        let alertNode = document.querySelector('.validation-alert');\r\n        if (!alertNode) {\r\n          alertNode = document.createElement('div');\r\n          alertNode.className = 'alert alert-error validation-alert';\r\n          alertNode.setAttribute('role', 'alert');\r\n          form.parentElement.insertBefore(alertNode, form);\r\n        }\r\n        alertNode.textContent = `Missing required fields: ${missingLabels.join(', ')}`;\r\n      };\r\n\r\n      const findMissingRequiredFields = () => {\r\n        const missing = [];\r\n        form.querySelectorAll('[data-required-label]').forEach((field) => {\r\n          const raw = (field.value || '').trim();\r\n          if (!raw) {\r\n            const group = field.closest('.form-group');\r\n            if (group) group.classList.add('form-group--missing');\r\n            field.classList.add('field--missing');\r\n            missing.push(field.getAttribute('data-required-label'));\r\n          }\r\n        });\r\n        return missing;\r\n      };\r\n\r\n      form.querySelectorAll('[data-required-label]').forEach((field) => {\r\n        field.addEventListener('input', () => {\r\n          if ((field.value || '').trim()) {\r\n            field.classList.remove('field--missing');\r\n            const group = field.closest('.form-group');\r\n            if (group) group.classList.remove('form-group--missing');\r\n          }\r\n        });\r\n      });\r\n\r\n      form.addEventListener('submit', (event) => {\r\n        if (tagInput.value.trim()) {\r\n          addTag(tagInput.value);\r\n          tagInput.value = '';\r\n        }\r\n\r\n        clearClientMissingState();\r\n        const missingLabels = findMissingRequiredFields();\r\n        if (missingLabels.length) {\r\n          event.preventDefault();\r\n          setValidationAlert(missingLabels);\r\n          const firstMissing = form.querySelector('.field--missing');\r\n          if (firstMissing) {\r\n            firstMissing.focus();\r\n            firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });\r\n          }\r\n        }\r\n      });\r\n\r\n      renderTags();\r\n    })();\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "reservations/index": function (locals, escapeFn, include, rethrow) {
var message = locals.message, isStaffView = locals.isStaffView, city = locals.city, isGuestReservationMode = locals.isGuestReservationMode, reservableEvents = locals.reservableEvents, selectedEventId = locals.selectedEventId, formatDate = locals.formatDate, formatTime = locals.formatTime, stats = locals.stats, isAdminUser = locals.isAdminUser, reservationsByEvent = locals.reservationsByEvent, archivedReservations = locals.archivedReservations, reservations = locals.reservations;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Reservations - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container reservations-page\">\r\n    ")
    ;  if (message) { 
    ; __append("\r\n      <div class=\"alert alert-info\" style=\"margin-top:1.5rem;\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    ")
    ;  if (!isStaffView) { 
    ; __append("\r\n      <section class=\"reservations-hero\">\r\n        <div>\r\n          <h1>Reserve a Company Event</h1>\r\n          <p>Browse active SOVA events in <strong>")
    ; __append(escapeFn( city ))
    ; __append("</strong>, request space for your party, and track each reservation below.</p>\r\n          ")
    ;  if (isGuestReservationMode) { 
    ; __append("\r\n            <p class=\"muted-text\">You can reserve without signing in. Enter your name and email in the reservation form.</p>\r\n          ")
    ;  } 
    ; __append("\r\n        </div>\r\n        <div class=\"reservations-hero-actions\">\r\n          <a href=\"/events\" class=\"btn btn-secondary\">Browse Events</a>\r\n        </div>\r\n      </section>\r\n\r\n      <section class=\"reservations-section\">\r\n        <div class=\"reservations-section-head\">\r\n          <div>\r\n            <h2>Available Events</h2>\r\n            <p>Reserve directly from any active company-hosted event.</p>\r\n          </div>\r\n        </div>\r\n\r\n        ")
    ;  if (!reservableEvents.length) { 
    ; __append("\r\n          <div class=\"workspace-card\">\r\n            <p class=\"muted-text\">There are no active events open for reservation right now.</p>\r\n          </div>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"reservable-events-grid\">\r\n            ")
    ;  reservableEvents.forEach(event => { 
    ; __append("\r\n              <article class=\"reservable-event-card ")
    ; __append(escapeFn( event.id === selectedEventId ? 'reservable-event-card-selected' : '' ))
    ; __append("\">\r\n                <div class=\"reservable-event-card-head\">\r\n                  <div>\r\n                    <h3><a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\">")
    ; __append(escapeFn( event.title ))
    ; __append("</a></h3>\r\n                    <p class=\"reservable-event-meta\">")
    ; __append(escapeFn( event.category ))
    ; __append(" • ")
    ; __append(escapeFn( event.location ))
    ; __append("</p>\r\n                  </div>\r\n                  <span class=\"badge-status ")
    ; __append(escapeFn( event.is_sold_out ? 'badge-rejected' : 'badge-approved' ))
    ; __append("\">\r\n                    ")
    ; __append(escapeFn( event.is_sold_out ? 'Sold Out' : event.available_spots + ' spots left' ))
    ; __append("\r\n                  </span>\r\n                </div>\r\n\r\n                <p class=\"reservable-event-time\">\r\n                  <strong>")
    ; __append(escapeFn( formatDate(event.start_at) ))
    ; __append("</strong>\r\n                  at ")
    ; __append(escapeFn( formatTime(event.start_at) ))
    ; __append("\r\n                  ")
    ;  if (event.end_at) { 
    ; __append("\r\n                    • ends ")
    ; __append(escapeFn( formatTime(event.end_at) ))
    ; __append("\r\n                  ")
    ;  } 
    ; __append("\r\n                </p>\r\n\r\n                <p>")
    ; __append(escapeFn( event.description ))
    ; __append("</p>\r\n\r\n                ")
    ;  if (event.my_status) { 
    ; __append("\r\n                  <p class=\"muted-text\">Your current request: <span class=\"badge-status badge-")
    ; __append(escapeFn( event.my_status ))
    ; __append("\">")
    ; __append(escapeFn( event.my_status ))
    ; __append("</span>")
    ; __append(escapeFn( event.my_guest_count ? ' for ' + event.my_guest_count + ' guest' + (event.my_guest_count === 1 ? '' : 's') : '' ))
    ; __append("</p>\r\n                ")
    ;  } 
    ; __append("\r\n\r\n                <div class=\"reservable-event-actions\">\r\n                  <a href=\"/events/")
    ; __append(escapeFn( event.id ))
    ; __append("\" class=\"btn btn-secondary btn-sm\">Event Details</a>\r\n                  <button\r\n                    type=\"button\"\r\n                    class=\"btn btn-primary btn-sm js-reserve-popup-trigger\"\r\n                    data-event-id=\"")
    ; __append(escapeFn( event.id ))
    ; __append("\"\r\n                    data-event-title=\"")
    ; __append(escapeFn( event.title ))
    ; __append("\"\r\n                    data-my-guest-count=\"")
    ; __append(escapeFn( Number(event.my_guest_count || 1) ))
    ; __append("\"\r\n                    data-my-notes=\"")
    ; __append(escapeFn( event.my_notes || '' ))
    ; __append("\"\r\n                    ")
    ; __append(escapeFn( event.is_sold_out ? 'disabled' : '' ))
    ; __append("\r\n                  >\r\n                    ")
    ; __append(escapeFn( event.my_status ? 'Update Reservation' : 'Reserve Space' ))
    ; __append("\r\n                  </button>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    ")
    ;  } else { 
    ; __append("\r\n      <section class=\"reservations-hero\">\r\n        <div>\r\n          <h1>Event Reservations</h1>\r\n          <p>Review all guest requests for active company events and update their status from one queue.</p>\r\n        </div>\r\n        ")
    ;  if (stats) { 
    ; __append("\r\n          <div class=\"reservation-stats-grid\">\r\n            <div class=\"reservation-stat-card\">\r\n              <span>Total</span>\r\n              <strong>")
    ; __append(escapeFn( stats.total ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"reservation-stat-card\">\r\n              <span>Pending</span>\r\n              <strong>")
    ; __append(escapeFn( stats.pending ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"reservation-stat-card\">\r\n              <span>Confirmed</span>\r\n              <strong>")
    ; __append(escapeFn( stats.confirmed ))
    ; __append("</strong>\r\n            </div>\r\n            <div class=\"reservation-stat-card\">\r\n              <span>Cancelled</span>\r\n              <strong>")
    ; __append(escapeFn( stats.cancelled ))
    ; __append("</strong>\r\n            </div>\r\n            ")
    ;  if (isAdminUser) { 
    ; __append("\r\n              <div class=\"reservation-stat-card reservation-stat-card-archived\">\r\n                <span>Archived</span>\r\n                <strong>")
    ; __append(escapeFn( stats.archived ))
    ; __append("</strong>\r\n              </div>\r\n            ")
    ;  } 
    ; __append("\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      </section>\r\n    ")
    ;  } 
    ; __append("\r\n\r\n    <section id=\"guest-reservations\" class=\"reservations-section\">\r\n      <h2>")
    ; __append(escapeFn( isStaffView ? 'All Guest Reservations' : 'My Reservations' ))
    ; __append("</h2>\r\n      ")
    ;  if (isStaffView && isAdminUser) { 
    ; __append("\r\n        <div class=\"reservations-section-head\">\r\n          <div>\r\n            <h2>Active Reservation Events</h2>\r\n            <p>Reservations are grouped by event for faster operations.</p>\r\n          </div>\r\n        </div>\r\n\r\n        ")
    ;  if (!reservationsByEvent || !reservationsByEvent.length) { 
    ; __append("\r\n          <p class=\"muted-text\">No active reservation events right now.</p>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div class=\"reservation-event-groups\">\r\n            ")
    ;  reservationsByEvent.forEach(group => { 
    ; __append("\r\n              <article class=\"reservation-event-group-card\">\r\n                <header class=\"reservation-event-group-head\">\r\n                  <div>\r\n                    <h3>")
    ; __append(escapeFn( group.event_title ))
    ; __append("</h3>\r\n                    <p class=\"muted-text\">\r\n                      ")
    ; __append(escapeFn( formatDate(group.start_at) ))
    ; __append("\r\n                      ")
    ;  if (group.end_at) { 
    ; __append("\r\n                        to ")
    ; __append(escapeFn( formatDate(group.end_at) ))
    ; __append("\r\n                      ")
    ;  } 
    ; __append("\r\n                    </p>\r\n                  </div>\r\n                  <div class=\"reservation-event-group-metrics\">\r\n                    <span class=\"badge-status badge-pending\">")
    ; __append(escapeFn( group.pending_count ))
    ; __append(" pending</span>\r\n                    <span class=\"badge-status badge-approved\">")
    ; __append(escapeFn( group.confirmed_count ))
    ; __append(" confirmed</span>\r\n                    <span class=\"badge-status badge-rejected\">")
    ; __append(escapeFn( group.cancelled_count ))
    ; __append(" cancelled</span>\r\n                    <span class=\"badge-status badge-city-soft\">")
    ; __append(escapeFn( group.total_guests ))
    ; __append(" guests total</span>\r\n                  </div>\r\n                </header>\r\n\r\n                <div style=\"overflow-x:auto;\">\r\n                  <table class=\"settings-table reservations-table\">\r\n                    <thead>\r\n                      <tr>\r\n                        <th>Guest</th>\r\n                        <th>Guests</th>\r\n                        <th>Status</th>\r\n                        <th>Notes</th>\r\n                        <th>Actions</th>\r\n                      </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                      ")
    ;  group.rows.forEach(reservation => { 
    ; __append("\r\n                        <tr>\r\n                          <td>")
    ; __append(escapeFn( reservation.customer_username ))
    ; __append("<br><small>")
    ; __append(escapeFn( reservation.customer_email ))
    ; __append("</small></td>\r\n                          <td>")
    ; __append(escapeFn( reservation.guest_count ))
    ; __append("</td>\r\n                          <td><span class=\"badge-status badge-")
    ; __append(escapeFn( reservation.status ))
    ; __append("\">")
    ; __append(escapeFn( reservation.status ))
    ; __append("</span></td>\r\n                          <td>")
    ; __append(escapeFn( reservation.notes || '—' ))
    ; __append("</td>\r\n                          <td>\r\n                            <div class=\"reservation-row-actions\">\r\n                              <form method=\"POST\" action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/status\" class=\"reservation-status-form\">\r\n                                <select name=\"status\" class=\"form-control reservation-status-select\">\r\n                                  <option value=\"pending\" ")
    ; __append(escapeFn( reservation.status === 'pending' ? 'selected' : '' ))
    ; __append(">Pending</option>\r\n                                  <option value=\"confirmed\" ")
    ; __append(escapeFn( reservation.status === 'confirmed' ? 'selected' : '' ))
    ; __append(">Confirmed</option>\r\n                                  <option value=\"cancelled\" ")
    ; __append(escapeFn( reservation.status === 'cancelled' ? 'selected' : '' ))
    ; __append(">Cancelled</option>\r\n                                </select>\r\n                                <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Save</button>\r\n                              </form>\r\n\r\n                              <form method=\"POST\" action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/archive\">\r\n                                <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Archive</button>\r\n                              </form>\r\n\r\n                              <button\r\n                                type=\"button\"\r\n                                class=\"btn btn-danger btn-sm js-delete-reservation-trigger\"\r\n                                data-delete-action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/delete\"\r\n                                data-event-title=\"")
    ; __append(escapeFn( reservation.event_title ))
    ; __append("\"\r\n                                data-reserver-name=\"")
    ; __append(escapeFn( reservation.customer_username ))
    ; __append("\"\r\n                              >Delete</button>\r\n                            </div>\r\n                          </td>\r\n                        </tr>\r\n                      ")
    ;  }) 
    ; __append("\r\n                    </tbody>\r\n                  </table>\r\n                </div>\r\n              </article>\r\n            ")
    ;  }) 
    ; __append("\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <div class=\"reservations-section-head\" style=\"margin-top: 24px;\">\r\n          <div>\r\n            <h2>Archived Reservations</h2>\r\n            <p>Archived reservations are retained temporarily, then deleted 7 days after event end.</p>\r\n          </div>\r\n        </div>\r\n\r\n        ")
    ;  if (!archivedReservations || !archivedReservations.length) { 
    ; __append("\r\n          <p class=\"muted-text\">No archived reservations.</p>\r\n        ")
    ;  } else { 
    ; __append("\r\n          <div style=\"overflow-x:auto;\">\r\n            <table class=\"settings-table reservations-table\">\r\n              <thead>\r\n                <tr>\r\n                  <th>Event</th>\r\n                  <th>Guest</th>\r\n                  <th>Guests</th>\r\n                  <th>Status</th>\r\n                  <th>Archived At</th>\r\n                  <th>Notes</th>\r\n                </tr>\r\n              </thead>\r\n              <tbody>\r\n                ")
    ;  archivedReservations.forEach(reservation => { 
    ; __append("\r\n                  <tr>\r\n                    <td>")
    ; __append(escapeFn( reservation.event_title ))
    ; __append("</td>\r\n                    <td>")
    ; __append(escapeFn( reservation.customer_username ))
    ; __append("<br><small>")
    ; __append(escapeFn( reservation.customer_email ))
    ; __append("</small></td>\r\n                    <td>")
    ; __append(escapeFn( reservation.guest_count ))
    ; __append("</td>\r\n                    <td><span class=\"badge-status badge-")
    ; __append(escapeFn( reservation.status ))
    ; __append("\">")
    ; __append(escapeFn( reservation.status ))
    ; __append("</span></td>\r\n                    <td>")
    ; __append(escapeFn( reservation.archived_at ? formatDate(reservation.archived_at) : '—' ))
    ; __append("</td>\r\n                    <td>")
    ; __append(escapeFn( reservation.notes || '—' ))
    ; __append("</td>\r\n                  </tr>\r\n                ")
    ;  }) 
    ; __append("\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n      ")
    ;  } else if (!reservations.length) { 
    ; __append("\r\n        <p class=\"muted-text\">No reservations on file.</p>\r\n      ")
    ;  } else { 
    ; __append("\r\n        <div style=\"overflow-x:auto;\">\r\n          <table class=\"settings-table reservations-table\">\r\n            <thead>\r\n              <tr>\r\n                <th>Event</th>\r\n                <th>Date</th>\r\n                ")
    ;  if (isStaffView) { 
    ; __append("<th>Guest</th>")
    ;  } 
    ; __append("\r\n                <th>Guests</th>\r\n                <th>Status</th>\r\n                <th>Notes</th>\r\n                ")
    ;  if (isStaffView) { 
    ; __append("<th>Actions</th>")
    ;  } 
    ; __append("\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              ")
    ;  reservations.forEach(reservation => { 
    ; __append("\r\n                <tr>\r\n                  <td>")
    ; __append(escapeFn( reservation.event_title ))
    ; __append("</td>\r\n                  <td>")
    ; __append(escapeFn( formatDate(reservation.start_at) ))
    ; __append("</td>\r\n                  ")
    ;  if (isStaffView) { 
    ; __append("\r\n                    <td>")
    ; __append(escapeFn( reservation.customer_username ))
    ; __append("<br><small>")
    ; __append(escapeFn( reservation.customer_email ))
    ; __append("</small></td>\r\n                  ")
    ;  } 
    ; __append("\r\n                  <td>")
    ; __append(escapeFn( reservation.guest_count ))
    ; __append("</td>\r\n                  <td>\r\n                    <span class=\"badge-status badge-")
    ; __append(escapeFn( reservation.status ))
    ; __append("\">")
    ; __append(escapeFn( reservation.status ))
    ; __append("</span>\r\n                  </td>\r\n                  <td>")
    ; __append(escapeFn( reservation.notes || '—' ))
    ; __append("</td>\r\n                  ")
    ;  if (isStaffView) { 
    ; __append("\r\n                    <td>\r\n                      <div class=\"reservation-row-actions\">\r\n                        <form method=\"POST\" action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/status\" class=\"reservation-status-form\">\r\n                          <select name=\"status\" class=\"form-control reservation-status-select\">\r\n                            <option value=\"pending\" ")
    ; __append(escapeFn( reservation.status === 'pending' ? 'selected' : '' ))
    ; __append(">Pending</option>\r\n                            <option value=\"confirmed\" ")
    ; __append(escapeFn( reservation.status === 'confirmed' ? 'selected' : '' ))
    ; __append(">Confirmed</option>\r\n                            <option value=\"cancelled\" ")
    ; __append(escapeFn( reservation.status === 'cancelled' ? 'selected' : '' ))
    ; __append(">Cancelled</option>\r\n                          </select>\r\n                          <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Save</button>\r\n                        </form>\r\n\r\n                        ")
    ;  if (isAdminUser) { 
    ; __append("\r\n                          <form method=\"POST\" action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/archive\">\r\n                            <button type=\"submit\" class=\"btn btn-secondary btn-sm\">Archive</button>\r\n                          </form>\r\n                          <button\r\n                            type=\"button\"\r\n                            class=\"btn btn-danger btn-sm js-delete-reservation-trigger\"\r\n                            data-delete-action=\"/reservations/")
    ; __append(escapeFn( reservation.id ))
    ; __append("/delete\"\r\n                            data-event-title=\"")
    ; __append(escapeFn( reservation.event_title ))
    ; __append("\"\r\n                            data-reserver-name=\"")
    ; __append(escapeFn( reservation.customer_username ))
    ; __append("\"\r\n                          >Delete</button>\r\n                        ")
    ;  } 
    ; __append("\r\n                      </div>\r\n                    </td>\r\n                  ")
    ;  } 
    ; __append("\r\n                </tr>\r\n              ")
    ;  }) 
    ; __append("\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n      ")
    ;  } 
    ; __append("\r\n    </section>\r\n  </main>\r\n\r\n  <div class=\"modal-backdrop\" id=\"reservationModal\" hidden>\r\n    <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"reservationModalTitle\">\r\n      <div class=\"modal-dialog-head\">\r\n        <h2 id=\"reservationModalTitle\">Reserve Event</h2>\r\n        <button type=\"button\" class=\"modal-close\" id=\"reservationModalClose\" aria-label=\"Close reservation dialog\">×</button>\r\n      </div>\r\n      <p class=\"modal-copy\" id=\"reservationModalCopy\">Complete your reservation details below.</p>\r\n\r\n      <form method=\"POST\" action=\"/reservations\" id=\"reservationModalForm\">\r\n        <input type=\"hidden\" name=\"eventId\" id=\"reservationEventId\">\r\n\r\n        ")
    ;  if (isGuestReservationMode) { 
    ; __append("\r\n          <div class=\"form-group\">\r\n            <label for=\"reservationGuestName\">Your Name</label>\r\n            <input type=\"text\" id=\"reservationGuestName\" name=\"guestName\" placeholder=\"Full name\" required>\r\n          </div>\r\n\r\n          <div class=\"form-group\">\r\n            <label for=\"reservationGuestEmail\">Email</label>\r\n            <input type=\"email\" id=\"reservationGuestEmail\" name=\"guestEmail\" placeholder=\"you@example.com\" required>\r\n          </div>\r\n        ")
    ;  } 
    ; __append("\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"reservationGuestCount\">Guests</label>\r\n          <select id=\"reservationGuestCount\" name=\"guestCount\">\r\n            ")
    ;  for (let guestOption = 1; guestOption <= 10; guestOption += 1) { 
    ; __append("\r\n              <option value=\"")
    ; __append(escapeFn( guestOption ))
    ; __append("\">")
    ; __append(escapeFn( guestOption ))
    ; __append("</option>\r\n            ")
    ;  } 
    ; __append("\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label for=\"reservationNotes\">Notes</label>\r\n          <input type=\"text\" id=\"reservationNotes\" name=\"notes\" placeholder=\"Accessibility, timing, or party notes\">\r\n        </div>\r\n\r\n        <div class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"reservationModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-primary\">Submit Reservation</button>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n\r\n  ")
    ;  if (isStaffView && isAdminUser) { 
    ; __append("\r\n    <div class=\"modal-backdrop\" id=\"reservationDeleteModal\" hidden>\r\n      <div class=\"modal-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"reservationDeleteModalTitle\">\r\n        <div class=\"modal-dialog-head\">\r\n          <h2 id=\"reservationDeleteModalTitle\">Delete Reservation</h2>\r\n          <button type=\"button\" class=\"modal-close\" id=\"reservationDeleteModalClose\" aria-label=\"Close delete reservation dialog\">×</button>\r\n        </div>\r\n        <p class=\"modal-copy\" id=\"reservationDeleteModalCopy\">Delete this reservation permanently?</p>\r\n        <p class=\"modal-copy modal-copy-soft\">This action cannot be undone. Consider Archive if you may need this history later.</p>\r\n\r\n        <form method=\"POST\" action=\"/reservations/0/delete\" id=\"reservationDeleteModalForm\" class=\"modal-actions\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" id=\"reservationDeleteModalCancel\">Cancel</button>\r\n          <button type=\"submit\" class=\"btn btn-danger\">Delete Permanently</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  ")
    ;  } 
    ; __append("\r\n\r\n  <script>\r\n  (function () {\r\n    const openModals = [];\r\n\r\n    const setBodyModalState = function () {\r\n      if (openModals.length) {\r\n        document.body.classList.add('modal-open');\r\n      } else {\r\n        document.body.classList.remove('modal-open');\r\n      }\r\n    };\r\n\r\n    const reservationModal = document.getElementById('reservationModal');\r\n    const reservationCloseButton = document.getElementById('reservationModalClose');\r\n    const reservationCancelButton = document.getElementById('reservationModalCancel');\r\n    const reservationCopy = document.getElementById('reservationModalCopy');\r\n    const reservationEventIdInput = document.getElementById('reservationEventId');\r\n    const reservationGuestCountSelect = document.getElementById('reservationGuestCount');\r\n    const reservationNotesInput = document.getElementById('reservationNotes');\r\n    const reserveTriggers = document.querySelectorAll('.js-reserve-popup-trigger');\r\n\r\n    let lastReservationTrigger = null;\r\n\r\n    const closeReservationModal = function () {\r\n      if (!reservationModal) return;\r\n      reservationModal.hidden = true;\r\n      const modalIndex = openModals.indexOf(reservationModal);\r\n      if (modalIndex >= 0) {\r\n        openModals.splice(modalIndex, 1);\r\n      }\r\n      setBodyModalState();\r\n      if (lastReservationTrigger) {\r\n        lastReservationTrigger.focus();\r\n      }\r\n    };\r\n\r\n    if (\r\n      reservationModal &&\r\n      reservationCloseButton &&\r\n      reservationCancelButton &&\r\n      reservationCopy &&\r\n      reservationEventIdInput &&\r\n      reservationGuestCountSelect &&\r\n      reservationNotesInput &&\r\n      reserveTriggers.length\r\n    ) {\r\n      reserveTriggers.forEach(function (trigger) {\r\n        trigger.addEventListener('click', function () {\r\n          lastReservationTrigger = trigger;\r\n          reservationEventIdInput.value = trigger.getAttribute('data-event-id');\r\n          reservationCopy.textContent = 'Reserve space for \"' + trigger.getAttribute('data-event-title') + '\".';\r\n          reservationGuestCountSelect.value = trigger.getAttribute('data-my-guest-count') || '1';\r\n          reservationNotesInput.value = trigger.getAttribute('data-my-notes') || '';\r\n          reservationModal.hidden = false;\r\n          if (!openModals.includes(reservationModal)) {\r\n            openModals.push(reservationModal);\r\n          }\r\n          setBodyModalState();\r\n          reservationCloseButton.focus();\r\n        });\r\n      });\r\n\r\n      reservationCloseButton.addEventListener('click', closeReservationModal);\r\n      reservationCancelButton.addEventListener('click', closeReservationModal);\r\n      reservationModal.addEventListener('click', function (event) {\r\n        if (event.target === reservationModal) {\r\n          closeReservationModal();\r\n        }\r\n      });\r\n    }\r\n\r\n    const deleteModal = document.getElementById('reservationDeleteModal');\r\n    const deleteModalClose = document.getElementById('reservationDeleteModalClose');\r\n    const deleteModalCancel = document.getElementById('reservationDeleteModalCancel');\r\n    const deleteModalCopy = document.getElementById('reservationDeleteModalCopy');\r\n    const deleteModalForm = document.getElementById('reservationDeleteModalForm');\r\n    const deleteTriggers = document.querySelectorAll('.js-delete-reservation-trigger');\r\n\r\n    let lastDeleteTrigger = null;\r\n\r\n    const closeDeleteModal = function () {\r\n      if (!deleteModal) return;\r\n      deleteModal.hidden = true;\r\n      const modalIndex = openModals.indexOf(deleteModal);\r\n      if (modalIndex >= 0) {\r\n        openModals.splice(modalIndex, 1);\r\n      }\r\n      setBodyModalState();\r\n      if (lastDeleteTrigger) {\r\n        lastDeleteTrigger.focus();\r\n      }\r\n    };\r\n\r\n    if (deleteModal && deleteModalClose && deleteModalCancel && deleteModalCopy && deleteModalForm && deleteTriggers.length) {\r\n      deleteTriggers.forEach(function (trigger) {\r\n        trigger.addEventListener('click', function () {\r\n          lastDeleteTrigger = trigger;\r\n          const eventTitle = trigger.getAttribute('data-event-title') || 'this event';\r\n          const reserverName = trigger.getAttribute('data-reserver-name') || 'this guest';\r\n          deleteModalForm.action = trigger.getAttribute('data-delete-action');\r\n          deleteModalCopy.textContent = 'Delete reservation for \"' + reserverName + '\" on \"' + eventTitle + '\" permanently?';\r\n          deleteModal.hidden = false;\r\n          if (!openModals.includes(deleteModal)) {\r\n            openModals.push(deleteModal);\r\n          }\r\n          setBodyModalState();\r\n          deleteModalClose.focus();\r\n        });\r\n      });\r\n\r\n      deleteModalClose.addEventListener('click', closeDeleteModal);\r\n      deleteModalCancel.addEventListener('click', closeDeleteModal);\r\n      deleteModal.addEventListener('click', function (event) {\r\n        if (event.target === deleteModal) {\r\n          closeDeleteModal();\r\n        }\r\n      });\r\n    }\r\n\r\n    document.addEventListener('keydown', function (event) {\r\n      if (event.key !== 'Escape') {\r\n        return;\r\n      }\r\n\r\n      const topModal = openModals[openModals.length - 1];\r\n      if (!topModal) {\r\n        return;\r\n      }\r\n\r\n      if (topModal === deleteModal) {\r\n        closeDeleteModal();\r\n        return;\r\n      }\r\n\r\n      if (topModal === reservationModal) {\r\n        closeReservationModal();\r\n      }\r\n    });\r\n  })();\r\n  </script>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/bars-entertainment": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Bars & Entertainment - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🍷 Bars & Entertainment</h1>\r\n          <p>Discover cocktail bars, lounges, and exclusive venues for an unforgettable night out</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Bars & Entertainment guide. Find the perfect venue for your next night out.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/city-highlights": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>City Highlights - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>✈️ City Highlights</h1>\r\n          <p>Essential destinations no visitor should miss - iconic landmarks and must-see attractions</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our City Highlights guide. Discover the must-see destinations in the city.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/culture-events": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Culture & Events - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🎭 Culture & Events</h1>\r\n          <p>Find museums, theaters, galleries, and attractions that define the city's character</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Culture & Events guide. Explore the artistic and cultural offerings in the city.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/day-trips": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Day Trip Ideas - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🎒 Day Trip Ideas</h1>\r\n          <p>Discover nearby destinations perfect for day trips and weekend getaways</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Day Trip Ideas guide. Find the perfect destination for your next getaway.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/fine-dining": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Fine Dining & Cuisine - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🍽️ Fine Dining & Cuisine</h1>\r\n          <p>Explore world-class restaurants and culinary experiences from every corner of the city</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Fine Dining & Cuisine guide. Discover the best culinary experiences the city has to offer.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/neighborhood-guides": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Neighborhood Guides - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🗺️ Neighborhood Guides</h1>\r\n          <p>Explore distinct neighborhoods with insider knowledge and local recommendations</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Neighborhood Guides. Discover what makes each neighborhood unique.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "sections/walking-tours": function (locals, escapeFn, include, rethrow) {
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Walking Tours - SOVA Scoop</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('../partials/navbar') )
    ; __append("\r\n  \r\n  <main>\r\n    <div class=\"section-page\">\r\n      <div class=\"container\">\r\n        <div class=\"section-hero\">\r\n          <h1>🚶 Walking Tours</h1>\r\n          <p>Self-guided and curated walking routes through the city's most beautiful areas</p>\r\n        </div>\r\n        \r\n        <div class=\"section-content\">\r\n          <!-- Add your content here -->\r\n          <p>Welcome to our Walking Tours guide. Explore the city on foot with our curated routes.</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('../partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "suggestions": function (locals, escapeFn, include, rethrow) {
var message = locals.message, messageType = locals.messageType, formData = locals.formData;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Suggestion Box - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('./partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"content-page support-page\">\r\n      <div class=\"support-hero\">\r\n        <div>\r\n          <p class=\"support-eyebrow\">Support Center</p>\r\n          <h1>Suggestion Box</h1>\r\n          <p>Share ideas for workflow improvements and guest experience enhancements.</p>\r\n        </div>\r\n        <div class=\"support-quick-links\">\r\n          <a class=\"support-chip\" href=\"/support\">Support Home</a>\r\n          <a class=\"support-chip\" href=\"/support/faq\">FAQ</a>\r\n          <a class=\"support-chip\" href=\"/support/contact\">Contact</a>\r\n        </div>\r\n      </div>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-")
    ; __append(escapeFn( messageType === 'success' ? 'success' : (messageType === 'error' ? 'error' : 'info') ))
    ; __append("\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <section class=\"support-section support-grid\">\r\n        <div class=\"support-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>Suggestion Box</h2>\r\n            <p>Submit ideas that improve planning, operations, or concierge workflows.</p>\r\n          </div>\r\n          <form method=\"POST\" action=\"/support/suggestions\" class=\"support-form\">\r\n            <div class=\"form-group\">\r\n              <label for=\"suggestion_name\">Name</label>\r\n              <input type=\"text\" id=\"suggestion_name\" name=\"suggestion_name\" value=\"")
    ; __append(escapeFn( formData.suggestion_name || '' ))
    ; __append("\" placeholder=\"Optional\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"suggestion_email\">Email</label>\r\n              <input type=\"email\" id=\"suggestion_email\" name=\"suggestion_email\" value=\"")
    ; __append(escapeFn( formData.suggestion_email || '' ))
    ; __append("\" placeholder=\"Optional if you do not need a reply\">\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"suggestion_subject\">Suggestion Title</label>\r\n              <input type=\"text\" id=\"suggestion_subject\" name=\"suggestion_subject\" value=\"")
    ; __append(escapeFn( formData.suggestion_subject || '' ))
    ; __append("\" required>\r\n            </div>\r\n            <div class=\"form-group\">\r\n              <label for=\"suggestion_message\">Suggestion Details</label>\r\n              <textarea id=\"suggestion_message\" name=\"suggestion_message\" rows=\"6\" required>")
    ; __append(escapeFn( formData.suggestion_message || '' ))
    ; __append("</textarea>\r\n            </div>\r\n            <button type=\"submit\" class=\"btn btn-primary\">Submit Suggestion</button>\r\n          </form>\r\n        </div>\r\n\r\n        <div class=\"support-card support-aside-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>What makes a strong suggestion?</h2>\r\n            <p>Useful requests are specific, scoped, and tied to a real concierge workflow.</p>\r\n          </div>\r\n          <ul class=\"support-list\">\r\n            <li>Explain who the feature helps: guest, employee, or admin.</li>\r\n            <li>Describe the friction in the current workflow.</li>\r\n            <li>Suggest the outcome you want, not just a UI tweak.</li>\r\n            <li>Call out whether the request is city-specific or platform-wide.</li>\r\n          </ul>\r\n        </div>\r\n      </section>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('./partials/footer') )
    ; __append("\r\n</body>\r\n</html>\r\n")
  return __output;

},
  "support": function (locals, escapeFn, include, rethrow) {
var message = locals.message, messageType = locals.messageType;
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n  <title>Support - Hotel Concierge</title>\r\n  <link rel=\"stylesheet\" href=\"/css/style.css\">\r\n</head>\r\n<body>\r\n  ")
    ; __append( include('./partials/navbar') )
    ; __append("\r\n\r\n  <main class=\"container\">\r\n    <div class=\"content-page support-page\">\r\n      <div class=\"support-hero\">\r\n        <div>\r\n          <p class=\"support-eyebrow\">Support Center</p>\r\n          <h1>Support Pages</h1>\r\n          <p>Support content now lives on separate pages so FAQ, Contact, and Suggestions are easier to use.</p>\r\n        </div>\r\n        <div class=\"support-quick-links\">\r\n          <a class=\"support-chip\" href=\"/support/faq\">FAQ</a>\r\n          <a class=\"support-chip\" href=\"/support/contact\">Contact</a>\r\n          <a class=\"support-chip\" href=\"/support/suggestions\">Suggestion Box</a>\r\n        </div>\r\n      </div>\r\n\r\n      ")
    ;  if (message) { 
    ; __append("\r\n        <div class=\"alert alert-")
    ; __append(escapeFn( messageType === 'success' ? 'success' : (messageType === 'error' ? 'error' : 'info') ))
    ; __append("\">")
    ; __append(escapeFn( message ))
    ; __append("</div>\r\n      ")
    ;  } 
    ; __append("\r\n\r\n      <section class=\"support-section support-grid\">\r\n        <article class=\"support-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>FAQ</h2>\r\n            <p>Read role-specific answers for guests, employees, and admins.</p>\r\n          </div>\r\n          <a href=\"/support/faq\" class=\"btn btn-primary\">Open FAQ</a>\r\n        </article>\r\n\r\n        <article class=\"support-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>Contact</h2>\r\n            <p>Send a direct support request to the platform team.</p>\r\n          </div>\r\n          <a href=\"/support/contact\" class=\"btn btn-primary\">Open Contact Page</a>\r\n        </article>\r\n\r\n        <article class=\"support-card\">\r\n          <div class=\"support-section-heading\">\r\n            <h2>Suggestion Box</h2>\r\n            <p>Submit platform and workflow improvement ideas.</p>\r\n          </div>\r\n          <a href=\"/support/suggestions\" class=\"btn btn-primary\">Open Suggestion Box</a>\r\n        </article>\r\n      </section>\r\n    </div>\r\n  </main>\r\n\r\n  ")
    ; __append( include('./partials/footer') )
    ; __append("\r\n</body>\r\n</html>")
  return __output;

}
};
