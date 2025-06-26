document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DEFINE ALL ELEMENT CONSTANTS ---
    const qrTypeSelect = document.getElementById('qr-type');
    const inputFieldsContainer = document.getElementById('input-fields');
    const fgColorInput = document.getElementById('fg-color');
    const bgColorInput = document.getElementById('bg-color');
    const transparentBgCheckbox = document.getElementById('transparent-bg');
    const dotStyleSelect = document.getElementById('dot-style');
    const errorCorrectionSelect = document.getElementById('error-correction');
    const qrSizeSlider = document.getElementById('qr-size');
    const qrSizeValueSpan = document.getElementById('qr-size-value');
    const logoUploadInput = document.getElementById('logo-upload');
    const logoPreviewImg = document.getElementById('logo-preview');
    const showLogoCheckbox = document.getElementById('show-logo');
    const removeLogoBtn = document.getElementById('remove-logo');
    const scanMeTextInput = document.getElementById('scan-me-text');
    const scanMeFontSelect = document.getElementById('scan-me-font');
    const scanMeFontSizeInput = document.getElementById('scan-me-font-size');
    const scanMeTextColorInput = document.getElementById('scan-me-text-color');
    const scanMeTextPreviewDiv = document.getElementById('scan-me-text-preview');
    const previewWrapperDiv = document.getElementById('preview-wrapper');
    const qrCodeCanvasDiv = document.getElementById('qr-code-canvas');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const presetNameInput = document.getElementById('preset-name');
    const savePresetBtn = document.getElementById('save-preset-btn');
    const loadPresetSelect = document.getElementById('load-preset-select');
    const loadPresetBtn = document.getElementById('load-preset-btn');
    const deletePresetBtn = document.getElementById('delete-preset-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const templatesUIContainer = document.getElementById('premade-templates-container');

    let currentLogo = null;
    let qrCodeInstance = null;

    const defaultSettings = {
        data: "https://example.com",
        width: 256,
        height: 256,
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "M",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 5,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: "#000000",
            type: "square",
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: { type: "" },
        cornersDotOptions: { type: "" }
    };

    qrCodeInstance = new QRCodeStyling(defaultSettings);
    qrCodeInstance.append(qrCodeCanvasDiv);

    const countryCodes = [
        { name: "Afghanistan (+93)", code: "93" }, { name: "Albania (+355)", code: "355" }, { name: "Algeria (+213)", code: "213" },
        { name: "American Samoa (+1-684)", code: "1-684" }, { name: "Andorra (+376)", code: "376" }, { name: "Angola (+244)", code: "244" },
        { name: "Argentina (+54)", code: "54" }, { name: "Armenia (+374)", code: "374" }, { name: "Australia (+61)", code: "61" },
        { name: "Austria (+43)", code: "43" }, { name: "Brazil (+55)", code: "55" }, { name: "Canada (+1)", code: "1" },
        { name: "China (+86)", code: "86" }, { name: "Egypt (+20)", code: "20" }, { name: "France (+33)", code: "33" },
        { name: "Germany (+49)", code: "49" }, { name: "Greece (+30)", code: "30" }, { name: "India (+91)", code: "91" },
        { name: "Indonesia (+62)", code: "62" }, { name: "Iran (+98)", code: "98" }, { name: "Iraq (+964)", code: "964" },
        { name: "Ireland (+353)", code: "353" }, { name: "Israel (+972)", code: "972" }, { name: "Italy (+39)", code: "39" },
        { name: "Japan (+81)", code: "81" }, { name: "Mexico (+52)", code: "52" }, { name: "Netherlands (+31)", code: "31" },
        { name: "New Zealand (+64)", code: "64" }, { name: "Nigeria (+234)", code: "234" }, { name: "Norway (+47)", code: "47" },
        { name: "Pakistan (+92)", code: "92" }, { name: "Philippines (+63)", code: "63" }, { name: "Poland (+48)", code: "48" },
        { name: "Portugal (+351)", code: "351" }, { name: "Russia (+7)", code: "7" }, { name: "Saudi Arabia (+966)", code: "966" },
        { name: "South Africa (+27)", code: "27" }, { name: "South Korea (+82)", code: "82" }, { name: "Spain (+34)", code: "34" },
        { name: "Sweden (+46)", code: "46" }, { name: "Switzerland (+41)", code: "41" }, { name: "Turkey (+90)", code: "90" },
        { name: "UAE (+971)", code: "971" }, { name: "UK (+44)", code: "44" }, { name: "USA (+1)", code: "1" },
        { name: "Vietnam (+84)", code: "84" }
    ].sort((a, b) => a.name.localeCompare(b.name));

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    function generateInputFields(type) {
        inputFieldsContainer.innerHTML = '';
        let fieldsHtml = `<div class="card-header"><h5><i class="bi bi-input-cursor-text"></i> Content</h5></div><div class="card-body">`;

        switch (type) {
            case 'whatsapp':
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="wa-country-code" class="form-label">Country Code</label>
                        <select id="wa-country-code" class="form-select">
                            ${countryCodes.map(c => `<option value="${c.code}" ${c.code === '1' ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="wa-phone" class="form-label">Phone Number (without country code)</label>
                        <input type="tel" id="wa-phone" class="form-control" placeholder="e.g., 5551234567">
                    </div>
                    <div class="mb-3">
                        <label for="wa-message" class="form-label">Pre-filled Message (Optional)</label>
                        <textarea id="wa-message" class="form-control" rows="3" placeholder="Hello!"></textarea>
                    </div>`;
                break;
            case 'url':
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="url-input" class="form-label">Website URL</label>
                        <input type="url" id="url-input" class="form-control" placeholder="https://example.com" value="https://example.com">
                    </div>`;
                break;
            case 'text':
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="text-input" class="form-label">Your Text</label>
                        <textarea id="text-input" class="form-control" rows="4" placeholder="Enter any text here">Your text here</textarea>
                    </div>`;
                break;
            case 'email':
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="email-to" class="form-label">Email Address</label>
                        <input type="email" id="email-to" class="form-control" placeholder="recipient@example.com">
                    </div>
                    <div class="mb-3">
                        <label for="email-subject" class="form-label">Subject (Optional)</label>
                        <input type="text" id="email-subject" class="form-control" placeholder="Email Subject">
                    </div>
                    <div class="mb-3">
                        <label for="email-body" class="form-label">Message (Optional)</label>
                        <textarea id="email-body" class="form-control" rows="3" placeholder="Email body text"></textarea>
                    </div>`;
                break;
            case 'sms':
                fieldsHtml += `
                     <div class="mb-3">
                        <label for="sms-country-code" class="form-label">Country Code</label>
                        <select id="sms-country-code" class="form-select">
                            ${countryCodes.map(c => `<option value="${c.code}" ${c.code === '1' ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="sms-phone" class="form-label">Phone Number (without country code)</label>
                        <input type="tel" id="sms-phone" class="form-control" placeholder="e.g., 5551234567">
                    </div>
                    <div class="mb-3">
                        <label for="sms-message" class="form-label">Message (Optional)</label>
                        <textarea id="sms-message" class="form-control" rows="3" placeholder="SMS content"></textarea>
                    </div>`;
                break;
            case 'wifi':
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="wifi-ssid" class="form-label">Network Name (SSID)</label>
                        <input type="text" id="wifi-ssid" class="form-control" placeholder="MyWiFiNetwork">
                    </div>
                    <div class="mb-3">
                        <label for="wifi-password" class="form-label">Password (Optional)</label>
                        <input type="password" id="wifi-password" class="form-control" placeholder="NetworkPassword">
                    </div>
                    <div class="mb-3">
                        <label for="wifi-encryption" class="form-label">Encryption Type</label>
                        <select id="wifi-encryption" class="form-select">
                            <option value="WPA" selected>WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">No Encryption</option>
                        </select>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="wifi-hidden">
                        <label class="form-check-label" for="wifi-hidden">Hidden SSID</label>
                    </div>`;
                break;
            case 'vcard':
                fieldsHtml += `
                    <p class="text-muted small">Fill in the details for the vCard contact.</p>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label for="vcard-firstname" class="form-label">First Name</label><input type="text" id="vcard-firstname" class="form-control"></div>
                        <div class="col-md-6 mb-3"><label for="vcard-lastname" class="form-label">Last Name</label><input type="text" id="vcard-lastname" class="form-control"></div>
                    </div>
                    <div class="mb-3"><label for="vcard-org" class="form-label">Organization</label><input type="text" id="vcard-org" class="form-control"></div>
                    <div class="mb-3"><label for="vcard-title" class="form-label">Job Title</label><input type="text" id="vcard-title" class="form-control"></div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label for="vcard-tel-work" class="form-label">Phone (Work)</label><input type="tel" id="vcard-tel-work" class="form-control"></div>
                        <div class="col-md-6 mb-3"><label for="vcard-tel-mobile" class="form-label">Phone (Mobile)</label><input type="tel" id="vcard-tel-mobile" class="form-control"></div>
                    </div>
                    <div class="mb-3"><label for="vcard-email" class="form-label">Email</label><input type="email" id="vcard-email" class="form-control"></div>
                    <div class="mb-3"><label for="vcard-website" class="form-label">Website</label><input type="url" id="vcard-website" class="form-control"></div>
                    <div class="mb-3"><label for="vcard-address" class="form-label">Address (Street)</label><input type="text" id="vcard-address" class="form-control"></div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label for="vcard-city" class="form-label">City</label><input type="text" id="vcard-city" class="form-control"></div>
                        <div class="col-md-6 mb-3"><label for="vcard-zip" class="form-label">ZIP Code</label><input type="text" id="vcard-zip" class="form-control"></div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><label for="vcard-state" class="form-label">State/Region</label><input type="text" id="vcard-state" class="form-control"></div>
                        <div class="col-md-6 mb-3"><label for="vcard-country" class="form-label">Country</label><input type="text" id="vcard-country" class="form-control"></div>
                    </div>
                    `;
                break;
        }
        fieldsHtml += `</div>`;
        inputFieldsContainer.innerHTML = fieldsHtml;
        inputFieldsContainer.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('input', debounce(updateQRCode, 250));
            el.addEventListener('change', updateQRCode);
        });
        jscolor.install();
    }

    function getSafeValue(elementId, defaultValue = '') {
        const el = document.getElementById(elementId);
        return el ? el.value : defaultValue;
    }
    function getSafeChecked(elementId, defaultValue = false) {
        const el = document.getElementById(elementId);
        return el ? el.checked : defaultValue;
    }

    function getQRCodeDataString() {
        const type = qrTypeSelect.value;
        let data = "https://example.com";

        try {
            switch (type) {
                case 'whatsapp':
                    const waCountry = getSafeValue('wa-country-code', '1').replace(/\D/g,'');
                    const waPhone = getSafeValue('wa-phone').replace(/\D/g,'');
                    const waMessage = encodeURIComponent(getSafeValue('wa-message'));
                    if (waPhone) data = `https://wa.me/${waCountry}${waPhone}${waMessage ? `?text=${waMessage}` : ''}`;
                    else data = " ";
                    break;
                case 'url':
                    data = getSafeValue('url-input', "https://example.com");
                    if (!data.match(/^(https?:\/\/|ftps?:\/\/|mailto:|tel:|sms:)/i) && data && data.includes('.')) {
                        data = "http://" + data;
                    } else if (!data.trim()) { // Check if data is empty or only whitespace
                        data = " ";
                    }
                    break;
                case 'text':
                    data = getSafeValue('text-input', " ");
                    if (!data.trim()) data = " ";
                    break;
                case 'email':
                    const emailTo = getSafeValue('email-to');
                    const emailSubject = encodeURIComponent(getSafeValue('email-subject'));
                    const emailBody = encodeURIComponent(getSafeValue('email-body'));
                    if (emailTo) data = `mailto:${emailTo}${emailSubject ? `?subject=${emailSubject}` : ''}${emailBody ? (emailSubject ? '&' : '?') + `body=${emailBody}` : ''}`;
                    else data = " ";
                    break;
                case 'sms':
                    const smsCountry = getSafeValue('sms-country-code', '1').replace(/\D/g,'');
                    const smsPhone = getSafeValue('sms-phone').replace(/\D/g,'');
                    const smsMessage = encodeURIComponent(getSafeValue('sms-message'));
                    if (smsPhone) data = `sms:${smsCountry}${smsPhone}${smsMessage ? `?body=${smsMessage}` : ''}`;
                    else data = " ";
                    break;
                case 'wifi':
                    const ssid = getSafeValue('wifi-ssid');
                    const password = getSafeValue('wifi-password');
                    const encryption = getSafeValue('wifi-encryption', 'WPA');
                    const hidden = getSafeChecked('wifi-hidden');
                    if (ssid) data = `WIFI:T:${encryption === 'nopass' ? '' : encryption};S:${ssid};${password ? `P:${password};` : ''}H:${hidden ? 'true' : 'false'};`;
                    else data = " ";
                    break;
                case 'vcard':
                    let vcardStr = "BEGIN:VCARD\nVERSION:3.0\n";
                    const fn = getSafeValue('vcard-firstname');
                    const ln = getSafeValue('vcard-lastname');
                    if (fn || ln) vcardStr += `N:${ln};${fn}\nFN:${fn} ${ln}\n`;
                    else { data = " "; break; }
                    const org = getSafeValue('vcard-org');
                    if (org) vcardStr += `ORG:${org}\n`;
                    const title = getSafeValue('vcard-title');
                    if (title) vcardStr += `TITLE:${title}\n`;
                    const telWork = getSafeValue('vcard-tel-work');
                    if (telWork) vcardStr += `TEL;TYPE=WORK,VOICE:${telWork}\n`;
                    const telMobile = getSafeValue('vcard-tel-mobile');
                    if (telMobile) vcardStr += `TEL;TYPE=CELL,VOICE:${telMobile}\n`;
                    const email = getSafeValue('vcard-email');
                    if (email) vcardStr += `EMAIL:${email}\n`;
                    const website = getSafeValue('vcard-website');
                    if (website) vcardStr += `URL:${website}\n`;
                    const adrStreet = getSafeValue('vcard-address');
                    const adrCity = getSafeValue('vcard-city');
                    const adrState = getSafeValue('vcard-state');
                    const adrZip = getSafeValue('vcard-zip');
                    const adrCountry = getSafeValue('vcard-country');
                    if (adrStreet || adrCity || adrState || adrZip || adrCountry) {
                         vcardStr += `ADR;TYPE=WORK:;;${adrStreet};${adrCity};${adrState};${adrZip};${adrCountry}\n`;
                    }
                    vcardStr += "END:VCARD";
                    data = vcardStr;
                    break;
                default:
                    data = " ";
            }
        } catch (error) {
            console.error("Error generating data string:", error);
            data = "Error";
        }
        return data.trim() === "" ? " " : data; // Ensure it's never truly empty
    }

    function updateQRCode() {
        if (!qrCodeInstance) return;

        const data = getQRCodeDataString();
        // This 'size' is the RENDER/DOWNLOAD size
        const renderSize = parseInt(qrSizeSlider.value);
        qrSizeValueSpan.textContent = renderSize;
        const currentDotStyle = dotStyleSelect.value;
        let cornersSquareType = "";
        let cornersDotType = "";

        if (['rounded', 'extra-rounded', 'classy', 'classy-rounded'].includes(currentDotStyle)) {
            cornersSquareType = 'extra-rounded';
            cornersDotType = 'dot';
        } else if (currentDotStyle === 'dots') {
            cornersSquareType = 'dot';
            cornersDotType = 'dot';
        }

        const options = {
            width: renderSize,  // Use the slider value for actual QR rendering
            height: renderSize, // Use the slider value for actual QR rendering
            data: data,
            margin: parseInt(defaultSettings.margin), // Or make this configurable
            dotsOptions: {
                color: fgColorInput.value,
                type: currentDotStyle,
            },
            backgroundOptions: {
                color: transparentBgCheckbox.checked ? '#FFFFFF00' : bgColorInput.value,
            },
            qrOptions: {
                errorCorrectionLevel: errorCorrectionSelect.value,
            },
            image: currentLogo && showLogoCheckbox.checked ? currentLogo : null,
            imageOptions: { ...defaultSettings.imageOptions },
            cornersSquareOptions: { type: cornersSquareType },
            cornersDotOptions: { type: cornersDotType }
        };
        
        if (options.image) {
            options.qrOptions.errorCorrectionLevel = 'H';
            errorCorrectionSelect.value = 'H';
        }

        qrCodeInstance.update(options);
        updateScanMeTextPreview();
    }
    
    function updateScanMeTextPreview() {
        const text = scanMeTextInput.value;
        const font = scanMeFontSelect.value;
        const size = scanMeFontSizeInput.value + 'px';
        const color = scanMeTextColorInput.value;

        scanMeTextPreviewDiv.textContent = text;
        scanMeTextPreviewDiv.style.fontFamily = font;
        scanMeTextPreviewDiv.style.fontSize = size;
        scanMeTextPreviewDiv.style.color = color;
        scanMeTextPreviewDiv.style.display = text ? 'block' : 'none';
        
        if (previewWrapperDiv.style.backgroundImage && previewWrapperDiv.style.backgroundImage !== 'none' && previewWrapperDiv.style.backgroundImage !== '') {
            previewWrapperDiv.style.backgroundColor = 'transparent';
        } else {
            previewWrapperDiv.style.backgroundColor = transparentBgCheckbox.checked ? 'transparent' : bgColorInput.value;
        }
    }

    /** ---- PRE-MADE TEMPLATES FEATURE ---- **/
    const templatesToShowInitially = 4; // Or 3, or any number for the first row
    let allFetchedTemplates = []; // Store all templates once fetched
    let currentlyDisplayedTemplates = 0;

    async function loadAndAddPreMadeTemplates() {
        if (!templatesUIContainer) {
            console.error("Templates UI container (#premade-templates-container) not found.");
            return;
        }
        templatesUIContainer.innerHTML = ''; // Clear previous, including any old "Show More" button

        try {
            const response = await fetch('templates.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching templates.json`);
            }
            allFetchedTemplates = await response.json(); // Store all templates

            if (allFetchedTemplates.length === 0) {
                templatesUIContainer.innerHTML = '<p class="text-muted small p-2">No pre-made templates available.</p>';
                return;
            }

            displayTemplates(0, templatesToShowInitially); // Display initial set

            if (allFetchedTemplates.length > templatesToShowInitially) {
                addShowMoreButton();
            }

        } catch (error) {
            console.error("Could not load or parse templates.json:", error);
            templatesUIContainer.innerHTML = '<p class="text-danger small p-2">Error: Could not load pre-made templates.</p>';
        }
    }

    function displayTemplates(startIndex, count) {
        const templatesToDisplay = allFetchedTemplates.slice(startIndex, startIndex + count);
        
        let row = templatesUIContainer.querySelector('.row.g-2');
        if (!row) { // Create row if it doesn't exist (e.g., on initial load)
            row = document.createElement('div');
            row.className = 'row g-2';
            templatesUIContainer.appendChild(row);
        }

        templatesToDisplay.forEach(template => {
            const col = document.createElement('div');
            // Adjust column classes for responsiveness if needed (e.g. col-6 col-sm-4 col-md-3)
            col.className = 'col-4 col-md-3 col-lg-3 template-item'; // Added 'template-item' class
            const templateButton = document.createElement('button');
            templateButton.className = 'btn w-100 h-100 template-thumbnail-btn p-1';
            templateButton.type = 'button';
            templateButton.title = template.name;

            const img = document.createElement('img');
            img.src = template.thumbnail;
            img.alt = template.name;
            img.className = 'img-fluid rounded';
            img.onerror = function() {
                this.src = 'assets/templates/thumb_placeholder.svg';
                this.alt = `Error loading ${template.name}`;
            };
            templateButton.appendChild(img);
            templateButton.addEventListener('click', () => applyTemplate(template));
            col.appendChild(templateButton);
            row.appendChild(col); // Append to the existing or new row
        });
        currentlyDisplayedTemplates = templatesUIContainer.querySelectorAll('.template-item').length;
    }

    function addShowMoreButton() {
        const remainingCount = allFetchedTemplates.length - currentlyDisplayedTemplates;
        if (remainingCount <= 0) return; // No more to show

        let showMoreContainer = templatesUIContainer.querySelector('.show-more-container');
        if (showMoreContainer) {
            showMoreContainer.remove(); // Remove old button if it exists
        }
        
        showMoreContainer = document.createElement('div');
        showMoreContainer.className = 'col-12 text-center mt-2 show-more-container'; // Full width

        const showMoreBtn = document.createElement('button');
        showMoreBtn.id = 'show-more-templates-btn';
        showMoreBtn.className = 'btn btn-outline-primary btn-sm';
        showMoreBtn.innerHTML = `<i class="bi bi-plus-circle"></i> Show More (+${remainingCount})`;
        showMoreBtn.addEventListener('click', handleShowMoreTemplates);
        
        showMoreContainer.appendChild(showMoreBtn);
        templatesUIContainer.appendChild(showMoreContainer); // Append button container after the row of templates
    }

    function handleShowMoreTemplates() {
        displayTemplates(currentlyDisplayedTemplates, allFetchedTemplates.length - currentlyDisplayedTemplates);
        
        const showMoreBtn = document.getElementById('show-more-templates-btn');
        if (showMoreBtn) {
            showMoreBtn.parentElement.remove(); // Remove the "Show More" button container after displaying all
        }
    }

    function applyTemplate(template) {
        // ... (your existing applyTemplate function remains the same)
        // Ensure this function correctly updates the QR code and other UI elements
        if (template.qrSettings) {
            fgColorInput.value = template.qrSettings.fgColor || '#000000';
            if (fgColorInput.jscolor) fgColorInput.jscolor.fromString(fgColorInput.value);

            transparentBgCheckbox.checked = template.qrSettings.transparentBg || false;
            if (template.qrSettings.transparentBg) {
                bgColorInput.value = '#FFFFFF';
                if (bgColorInput.jscolor) bgColorInput.jscolor.fromString('#FFFFFF');
            } else {
                bgColorInput.value = template.qrSettings.bgColor || '#FFFFFF';
                if (bgColorInput.jscolor) bgColorInput.jscolor.fromString(bgColorInput.value);
            }
            dotStyleSelect.value = template.qrSettings.dotStyle || 'square';
            if (template.qrSettings.errorCorrection) {
                errorCorrectionSelect.value = template.qrSettings.errorCorrection;
            }
        }

        if (template.scanMeTextSettings) {
            scanMeTextInput.value = template.scanMeTextSettings.text || '';
            scanMeFontSelect.value = template.scanMeTextSettings.font || 'Arial, sans-serif';
            scanMeFontSizeInput.value = template.scanMeTextSettings.fontSize || '20';
            scanMeTextColorInput.value = template.scanMeTextSettings.textColor || '#000000';
            if (scanMeTextColorInput.jscolor) scanMeTextColorInput.jscolor.fromString(scanMeTextColorInput.value);
        }

        if (template.frameImage) {
            previewWrapperDiv.style.backgroundImage = `url('${template.frameImage}')`;
            previewWrapperDiv.style.backgroundSize = 'contain';
            previewWrapperDiv.style.backgroundPosition = 'center';
            previewWrapperDiv.style.backgroundRepeat = 'no-repeat';
            previewWrapperDiv.style.padding = template.frameWrapperPadding || '15px';
            previewWrapperDiv.style.backgroundColor = 'transparent'; 
        } else {
            previewWrapperDiv.style.backgroundImage = 'none';
            previewWrapperDiv.style.padding = '15px'; // Default padding
        }
        updateQRCode();
    }
    /** ---- END PRE-MADE TEMPLATES FEATURE ---- **/



    /** ---- THEME FUNCTION ---- **/
    function applyTheme(theme, shouldUpdateQR = true) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-stars-fill');
        } else {
            themeIcon.classList.remove('bi-moon-stars-fill');
            themeIcon.classList.add('bi-sun-fill');
        }
        jscolor.install(); 

        if (shouldUpdateQR) {
            updateQRCode();
        }
    }
    /** ---- END THEME FUNCTION ---- **/

    /** ---- PRESET FUNCTIONS ---- **/
    const PRESETS_STORAGE_KEY = 'qrGeneratorPresets_v2';

    function getAllSettings() {
        const settings = {
            qrType: qrTypeSelect.value,
            fgColor: fgColorInput.value,
            bgColor: bgColorInput.value,
            transparentBg: transparentBgCheckbox.checked,
            dotStyle: dotStyleSelect.value,
            errorCorrection: errorCorrectionSelect.value,
            qrSize: qrSizeSlider.value,
            showLogo: showLogoCheckbox.checked,
            logoWasPresent: !!currentLogo, // Store if a logo was there, not the logo data itself for presets
            scanMeText: scanMeTextInput.value,
            scanMeFont: scanMeFontSelect.value,
            scanMeFontSize: scanMeFontSizeInput.value,
            scanMeTextColor: scanMeTextColorInput.value,
            frameImage: previewWrapperDiv.style.backgroundImage.includes('url(') ? previewWrapperDiv.style.backgroundImage : null,
            frameWrapperPadding: previewWrapperDiv.style.padding,
            inputs: {}
        };
        inputFieldsContainer.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.id) {
                 settings.inputs[el.id] = el.type === 'checkbox' ? el.checked : el.value;
            }
        });
        return settings;
    }

    function applyAllSettings(settings) {
        qrTypeSelect.value = settings.qrType;
        generateInputFields(settings.qrType);

        setTimeout(() => { // Delay to ensure dynamic fields are rendered
            if (settings.inputs) {
                Object.keys(settings.inputs).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        if (el.type === 'checkbox') el.checked = settings.inputs[id];
                        else el.value = settings.inputs[id];
                    }
                });
            }

            fgColorInput.value = settings.fgColor;
            if(fgColorInput.jscolor) fgColorInput.jscolor.fromString(settings.fgColor);
            bgColorInput.value = settings.bgColor;
            if(bgColorInput.jscolor) bgColorInput.jscolor.fromString(settings.bgColor);
            transparentBgCheckbox.checked = settings.transparentBg;
            dotStyleSelect.value = settings.dotStyle;
            errorCorrectionSelect.value = settings.errorCorrection;
            qrSizeSlider.value = settings.qrSize;
            showLogoCheckbox.checked = settings.showLogo; // Restore show logo state
            // Logo itself is not restored from preset; user needs to re-upload if 'logoWasPresent' is true
            if (settings.logoWasPresent && !currentLogo) {
                // Optionally, display a message or highlight logo upload
                console.info("Preset included a logo. Please re-upload if desired.");
            } else if (!settings.logoWasPresent) {
                currentLogo = null; // Ensure logo is cleared if preset didn't have one
                logoPreviewImg.src = "#";
                logoPreviewImg.style.display = 'none';
                logoUploadInput.value = '';
                removeLogoBtn.style.display = 'none';
            }


            scanMeTextInput.value = settings.scanMeText;
            scanMeFontSelect.value = settings.scanMeFont;
            scanMeFontSizeInput.value = settings.scanMeFontSize;
            scanMeTextColorInput.value = settings.scanMeTextColor;
            if(scanMeTextColorInput.jscolor) scanMeTextColorInput.jscolor.fromString(settings.scanMeTextColor);

            // Restore frame from preset
            if (settings.frameImage && settings.frameImage !== 'none') {
                previewWrapperDiv.style.backgroundImage = settings.frameImage;
                previewWrapperDiv.style.backgroundSize = 'contain';
                previewWrapperDiv.style.backgroundPosition = 'center';
                previewWrapperDiv.style.backgroundRepeat = 'no-repeat';
                previewWrapperDiv.style.padding = settings.frameWrapperPadding || '15px';
            } else {
                previewWrapperDiv.style.backgroundImage = 'none';
                previewWrapperDiv.style.padding = '15px';
            }

            updateQRCode();
        }, 200); // Slightly longer delay for robustness
    }

    function loadPresetsList() {
        const presets = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) || '{}');
        loadPresetSelect.innerHTML = '<option value="">Load a preset...</option>';
        Object.keys(presets).sort().forEach(name => { // Sort preset names alphabetically
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            loadPresetSelect.appendChild(option);
        });
    }
    /** ---- END PRESET FUNCTIONS ---- **/

    // --- ATTACH EVENT LISTENERS (for non-dynamic elements) ---
    qrTypeSelect.addEventListener('change', () => {
        generateInputFields(qrTypeSelect.value);
        updateQRCode(); // Update QR after new fields are ready
    });

    // Debounce listeners for performance
    [fgColorInput, bgColorInput, scanMeTextColorInput].forEach(el => el.addEventListener('input', debounce(updateQRCode, 150)));
    [transparentBgCheckbox, dotStyleSelect, errorCorrectionSelect, qrSizeSlider,
     scanMeTextInput, scanMeFontSelect, scanMeFontSizeInput, showLogoCheckbox].forEach(el => el.addEventListener('input', debounce(updateQRCode, 250)));


    logoUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentLogo = e.target.result;
                logoPreviewImg.src = currentLogo;
                logoPreviewImg.style.display = 'block';
                removeLogoBtn.style.display = 'inline-block';
                showLogoCheckbox.checked = true; // Automatically enable logo display
                // errorCorrectionSelect.value = 'H'; // Automatically set high EC for logo
                updateQRCode();
            };
            reader.readAsDataURL(file);
        }
    });
    removeLogoBtn.addEventListener('click', () => {
        currentLogo = null;
        logoPreviewImg.src = "#";
        logoPreviewImg.style.display = 'none';
        logoUploadInput.value = ''; // Clear the file input
        removeLogoBtn.style.display = 'none';
        showLogoCheckbox.checked = false; // Uncheck show logo
        updateQRCode();
    });

    downloadPngBtn.addEventListener('click', () => {
        html2canvas(previewWrapperDiv, {
            backgroundColor: transparentBgCheckbox.checked && (!previewWrapperDiv.style.backgroundImage || previewWrapperDiv.style.backgroundImage === 'none') ? null : (previewWrapperDiv.style.backgroundImage && previewWrapperDiv.style.backgroundImage !== 'none' ? 'transparent' : bgColorInput.value),
            scale: 2, // Higher scale for better quality
            useCORS: true // Important if logo is from external source (though here it's dataURL)
        }).then(canvas => {
            canvas.toBlob(function(blob) {
                saveAs(blob, "qr-code-styled.png");
            });
        }).catch(err => {
            console.error("Error generating PNG with html2canvas:", err);
            alert("Error generating PNG. Check console for details. Ensure all assets are loaded correctly.");
        });
    });
    downloadSvgBtn.addEventListener('click', () => {
        // SVG from QRCodeStyling does not include html2canvas elements like frames or "Scan Me" text
        if (previewWrapperDiv.style.backgroundImage && previewWrapperDiv.style.backgroundImage !== 'none') {
            alert("SVG download includes only the QR code itself, not the frame or 'SCAN ME' text. For the full design, please use PNG download. You can add text/frames in an SVG editor if needed.");
        } else if (scanMeTextInput.value.trim() !== '') {
             alert("SVG download includes only the QR code itself, not the 'SCAN ME' text. For the full design, please use PNG download. You can add text in an SVG editor if needed.");
        }
        qrCodeInstance.download({ name: "qr-code", extension: "svg" });
    });

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('qrGeneratorTheme', newTheme);
        applyTheme(newTheme, true); // Update QR with new theme colors if needed
    });

    savePresetBtn.addEventListener('click', () => {
        const name = presetNameInput.value.trim();
        if (!name) { alert("Please enter a name for the preset."); return; }
        const presets = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) || '{}');
        presets[name] = getAllSettings();
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
        loadPresetsList(); // Refresh the dropdown
        presetNameInput.value = ''; // Clear input field
        alert(`Preset "${name}" saved!`);
    });
    loadPresetBtn.addEventListener('click', () => {
        const name = loadPresetSelect.value;
        if (!name) { alert("Please select a preset to load."); return; }
        const presets = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) || '{}');
        if (presets[name]) {
            applyAllSettings(presets[name]);
            alert(`Preset "${name}" loaded!`);
        } else {
            alert("Preset not found.");
        }
    });
    deletePresetBtn.addEventListener('click', () => {
        const name = loadPresetSelect.value;
        if (!name) { alert("Please select a preset to delete."); return; }
        const presets = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) || '{}');
        if (presets[name]) {
            if (confirm(`Are you sure you want to delete preset "${name}"?`)) {
                delete presets[name];
                localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
                loadPresetsList(); // Refresh the dropdown
                alert(`Preset "${name}" deleted.`);
            }
        } else {
            alert("Preset not found.");
        }
    });

    // --- INITIALIZATION ORDER ---
    generateInputFields(qrTypeSelect.value);
    loadAndAddPreMadeTemplates(); // Fetch and display templates

    const savedTheme = localStorage.getItem('qrGeneratorTheme');
    if (savedTheme) {
        applyTheme(savedTheme, false); // Apply theme but don't update QR yet
    } else {
        applyTheme('light', false); // Default theme
    }

    loadPresetsList(); // Load saved presets into dropdown
    updateQRCode();    // Generate initial QR code with defaults
    jscolor.install(); // Initialize color pickers

}); // End of DOMContentLoaded

// Polyfill for saveAs (if you're using FileSaver.js)
if (typeof saveAs === 'undefined' && typeof FileSaver !== 'undefined') {
    var saveAs = FileSaver.saveAs;
}