// ================================================
// BERKAN OTO KURTARMA - TAM İL + İLÇE + MOBİL MENÜ
// ================================================

document.addEventListener('DOMContentLoaded', () => {

    // ====================== MOBİL MENÜ ======================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburgerIcon.classList.toggle('fa-bars');
        hamburgerIcon.classList.toggle('fa-times');
    });

    // Close menu when clicking X or any link (güvenilir versiyon)
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.textContent.trim() === '✕') {
            navLinks.classList.remove('active');
            hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // ====================== DEBOUNCE ======================
    function debounce(func, delay = 400) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // ====================== AUTOCOMPLETE ======================
    async function fetchAutocomplete(query) {
        if (query.length < 3) return [];
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        return data.features.filter(p => p.properties.country === "Turkey");
    }

    function setupAutocomplete(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        const search = debounce(async () => {
            const query = input.value.trim();
            list.innerHTML = "";
            if (query.length < 3) return;

            try {
                const places = await fetchAutocomplete(query);
                places.forEach(place => {
                    const name = place.properties.name || "";
                    const city = place.properties.city || "";
                    const district = place.properties.district || place.properties.county || "";
                    const fullName = `${name}, ${district} / ${city}`.replace(/,\s*$/, "");

                    const item = document.createElement("div");
                    item.className = "autocomplete-item";
                    item.textContent = fullName;
                    item.onclick = () => { input.value = fullName; list.innerHTML = ""; };
                    list.appendChild(item);
                });
            } catch (e) { console.error("Autocomplete hatası:", e); }
        });

        input.addEventListener("input", search);

        document.addEventListener("click", (e) => {
            if (e.target !== input && !list.contains(e.target)) list.innerHTML = "";
        });
    }

    setupAutocomplete("nereden", "nereden-list");
    setupAutocomplete("nereye", "nereye-list");

    // ====================== TÜM 81 İL + İLÇELER ======================
    const iller = {
        "Adana": ["Seyhan","Yüreğir","Çukurova","Sarıçam","Aladağ","Ceyhan","Feke","İmamoğlu","Karaisalı","Kozan","Pozantı"],
        "Adıyaman": ["Merkez","Besni","Kahta","Gölbaşı","Gerger","Çelikhan","Samsat","Sincik","Tut"],
        "Afyonkarahisar": ["Merkez","Dinar","Sandıklı","Bolvadin","Çay","Emirdağ","İhsaniye"],
        "Ağrı": ["Merkez","Doğubayazıt","Patnos","Eleşkirt","Diyadin"],
        "Aksaray": ["Merkez","Ortaköy","Ağaçören","Güzelyurt","Sultanhanı"],
        "Amasya": ["Merkez","Merzifon","Taşova","Göynücek","Hamamözü"],
        "Ankara": ["Çankaya","Keçiören","Yenimahalle","Mamak","Etimesgut","Sincan","Pursaklar"],
        "Antalya": ["Muratpaşa","Kepez","Alanya","Manavgat","Konyaaltı","Serik"],
        "Ardahan": ["Merkez","Çıldır","Göle","Posof","Damal"],
        "Artvin": ["Merkez","Hopa","Arhavi","Borçka","Yusufeli"],
        "Aydın": ["Efeler","Nazilli","Söke","Kuşadası","Didim","Çine"],
        "Balıkesir": ["Karesi","Altıeylül","Bandırma","Edremit","Bigadiç","Erdek"],
        "Bartın": ["Merkez","Ulus","Amasra","Kurucaşile"],
        "Batman": ["Merkez","Beşiri","Gercüş","Hasankeyf","Kozluk","Sason"],
        "Bayburt": ["Merkez","Aydıntepe","Demirözü"],
        "Bilecik": ["Merkez","Bozüyük","Gölpazarı","Osmaneli","Söğüt"],
        "Bingöl": ["Merkez","Adaklı","Genç","Karlıova","Solhan","Yayladere"],
        "Bitlis": ["Merkez","Adilcevaz","Ahlat","Güroymak","Hizan","Mutki","Tatvan"],
        "Bolu": ["Merkez","Düzce","Gerede","Mengen","Mudurnu"],
        "Burdur": ["Merkez","Bucak","Gölhisar","Tefenni","Yeşilova"],
        "Bursa": ["Osmangazi","Nilüfer","Yıldırım","İnegöl","Gemlik","Mudanya","Kestel"],
        "Çanakkale": ["Merkez","Biga","Çan","Gelibolu","Lapseki"],
        "Çankırı": ["Merkez","Çerkeş","Eldivan","Ilgaz","Kurşunlu"],
        "Çorum": ["Merkez","Alaca","İskilip","Kargı","Osmancık"],
        "Denizli": ["Pamukkale","Merkezefendi","Acıpayam","Honaz","Çivril"],
        "Diyarbakır": ["Bağlar","Kayapınar","Sur","Yenişehir","Bismil","Silvan"],
        "Düzce": ["Merkez","Akçakoca","Çilimli","Gölyaka","Kaynaşlı"],
        "Edirne": ["Merkez","Keşan","Uzunköprü","İpsala"],
        "Elazığ": ["Merkez","Karakoçan","Kovancılar","Maden","Palu"],
        "Erzincan": ["Merkez","Refahiye","Tercan","Üzümlü"],
        "Erzurum": ["Yakutiye","Palandöken","Aziziye","Oltu","Horasan"],
        "Eskişehir": ["Odunpazarı","Tepebaşı","Sivrihisar","Çifteler"],
        "Gaziantep": ["Şahinbey","Şehitkamil","Nizip","İslahiye"],
        "Giresun": ["Merkez","Bulancak","Espiye","Şebinkarahisar"],
        "Gümüşhane": ["Merkez","Kelkit","Şiran","Torul"],
        "Hakkari": ["Merkez","Çukurca","Şemdinli","Yüksekova"],
        "Hatay": ["Antakya","İskenderun","Defne","Samandağ","Dörtyol"],
        "Iğdır": ["Merkez","Aralık","Karakoyunlu","Tuzluca"],
        "Isparta": ["Merkez","Eğirdir","Süleyman Demirel","Yalvaç"],
        "İstanbul": ["Kadıköy","Beşiktaş","Üsküdar","Maltepe","Kartal","Pendik","Tuzla","Şişli","Bakırköy","Avcılar","Başakşehir","Sultangazi"],
        "İzmir": ["Konak","Bornova","Karşıyaka","Buca","Bayraklı","Karabağlar","Çiğli"],
        "Kahramanmaraş": ["Onikişubat","Dulkadiroğlu","Afşin","Elbistan","Göksun"],
        "Karabük": ["Merkez","Eflani","Safranbolu","Yenice"],
        "Karaman": ["Merkez","Ermenek","Sarıveliler"],
        "Kars": ["Merkez","Kağızman","Sarıkamış","Selim"],
        "Kastamonu": ["Merkez","Cide","İnebolu","Taşköprü"],
        "Kayseri": ["Melikgazi","Kocasinan","Talas","Develi","Bünyan"],
        "Kırıkkale": ["Merkez","Bahşili","Delice","Keskin"],
        "Kırklareli": ["Merkez","Lüleburgaz","Babaeski","Demirköy"],
        "Kırşehir": ["Merkez","Akçakent","Çiçekdağı","Kaman"],
        "Kocaeli": ["İzmit","Gebze","Körfez","Darıca","Çayırova","Dilovası","Başiskele"],
        "Konya": ["Meram","Selçuklu","Karatay","Ereğli","Beyşehir"],
        "Kütahya": ["Merkez","Tavşanlı","Simav","Emet"],
        "Malatya": ["Battalgazi","Yeşilyurt","Akçadağ","Doğanşehir"],
        "Manisa": ["Yunusemre","Şehzadeler","Turgutlu","Akhisar","Salihli"],
        "Mardin": ["Merkez","Kızıltepe","Nusaybin","Artuklu"],
        "Mersin": ["Yenişehir","Toroslar","Akdeniz","Tarsus","Erdemli"],
        "Muğla": ["Menteşe","Bodrum","Fethiye","Dalaman","Marmaris"],
        "Muş": ["Merkez","Bulanık","Malazgirt","Varto"],
        "Nevşehir": ["Merkez","Ürgüp","Gülşehir","Hacıbektaş"],
        "Niğde": ["Merkez","Bor","Ulukışla","Çamardı"],
        "Ordu": ["Merkez","Altınordu","Fatsa","Ünye","Perşembe"],
        "Osmaniye": ["Merkez","Kadirli","Bahçe","Düziçi"],
        "Rize": ["Merkez","Çayeli","Ardeşen","Pazar"],
        "Sakarya": ["Serdivan","Adapazarı","Körfez","Hendek","Akyazı"],
        "Samsun": ["İlkadım","Atakum","Tekkeköy","Bafra","Çarşamba"],
        "Siirt": ["Merkez","Kurtalan","Pervari","Baykan"],
        "Sinop": ["Merkez","Boyabat","Gerze","Ayancık"],
        "Sivas": ["Merkez","Yıldızeli","Şarkışla","Gemerek"],
        "Şanlıurfa": ["Haliliye","Eyyübiye","Siverek","Viranşehir","Suruç"],
        "Şırnak": ["Merkez","Cizre","Silopi","İdil","Nusaybin"],
        "Tekirdağ": ["Çorlu","Süleymanpaşa","Kapaklı","Malkara"],
        "Tokat": ["Merkez","Turhal","Zile","Erbaa"],
        "Trabzon": ["Ortahisar","Akçaabat","Arsin","Of","Vakfıkebir"],
        "Tunceli": ["Merkez","Pertek","Çemişgezek","Hozat"],
        "Uşak": ["Merkez","Banaz","Eşme","Sivaslı"],
        "Van": ["İpekyolu","Edremit","Tuşba","Muradiye","Özalp"],
        "Yalova": ["Merkez","Çiftlikköy","Armutlu","Altınova","Çınarcık","Termal"],
        "Yozgat": ["Merkez","Akdağmadeni","Boğazlıyan","Sorgun"],
        "Zonguldak": ["Merkez","Karaelmas","Devrek","Çaycuma","Ereğli"]
    };

    const ilSelect = document.getElementById("ilSelect");
    const ilceSelect = document.getElementById("ilceSelect");

    Object.keys(iller).sort().forEach(il => {
        const opt = document.createElement("option");
        opt.value = il;
        opt.textContent = il;
        ilSelect.appendChild(opt);
    });

    ilSelect.addEventListener("change", () => {
        ilceSelect.innerHTML = '<option value="">İlçe Seç</option>';
        const secilenIl = ilSelect.value;
        if (iller[secilenIl]) {
            iller[secilenIl].forEach(ilce => {
                const opt = document.createElement("option");
                opt.value = ilce;
                opt.textContent = ilce;
                ilceSelect.appendChild(opt);
            });
        }
    });

    ilceSelect.addEventListener("change", () => {
        if (ilceSelect.value && ilSelect.value) {
            document.getElementById("nereden").value = `${ilceSelect.value}, ${ilSelect.value}`;
        }
    });

    // ====================== KONUM AL ======================
    window.konumAl = async function () {
        if (!navigator.geolocation) return alert("❌ Konum desteklenmiyor.");
        try {
            const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 }));
            const { latitude: lat, longitude: lon } = pos.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
            const data = await res.json();
            document.getElementById("nereden").value = data.display_name || "Mevcut Konum";
            alert("✅ Konum alındı!");
        } catch (err) { alert("❌ Konum alınamadı."); }
    };

    // ====================== FİYAT HESAPLAMA ======================
    window.fiyatHesapla = async function () {
        const nereden = document.getElementById("nereden").value.trim();
        const nereye = document.getElementById("nereye").value.trim();
        const aracCarpan = parseFloat(document.getElementById("aracTipi").value) || 1;

        const btn = document.querySelector(".calc-btn");
        const sonucKutusu = document.getElementById("sonuc-kutusu");
        const fiyatSpan = document.getElementById("fiyat");
        const mesafeBilgisi = document.getElementById("mesafe-bilgisi");
        const whatsappBtn = document.getElementById("whatsappLink");

        if (!nereden || !nereye) return alert("❌ Nereden ve Nereye doldur!");

        btn.innerHTML = `⏳ Hesaplanıyor...`;
        btn.disabled = true;

        try {
            const getCoords = async (adres) => {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adres)}&limit=1`);
                const data = await res.json();
                if (!data.length) throw new Error("Adres yok");
                return [data[0].lon, data[0].lat];
            };

            const start = await getCoords(nereden);
            const end = await getCoords(nereye);

            const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.join(',')};${end.join(',')}?overview=false`);
            const routeData = await routeRes.json();

            const km = routeData.routes[0].distance / 1000;

            let acilis = 550;
            let kmUcret = 32;
            let toplam = acilis + (km * kmUcret);
            toplam *= aracCarpan;

            const saat = new Date().getHours();
            if (saat >= 22 || saat <= 6) toplam *= 1.25;
            if (toplam < 850) toplam = 850;
            if (km > 120) toplam += 450;

            toplam = Math.round(toplam);

            fiyatSpan.textContent = `${toplam} TL`;
            mesafeBilgisi.innerHTML = `📏 Mesafe: <strong>${km.toFixed(1)} km</strong>`;
            sonucKutusu.classList.remove("hidden");

            const mesaj = `Merhaba Berkan Oto Kurtarma!\n\n📍 Nereden: ${nereden}\n🏁 Nereye: ${nereye}\n🚗 Araç: ${document.getElementById("aracTipi").options[document.getElementById("aracTipi").selectedIndex].text}\n📏 Mesafe: ${km.toFixed(1)} km\n💰 Tahmini Ücret: ${toplam} TL\n\nHemen gelin!`;
            whatsappBtn.href = `https://wa.me/905322742586?text=${encodeURIComponent(mesaj)}`;
            whatsappBtn.style.display = "flex";

        } catch (err) {
            console.error(err);
            alert("❌ Rota hesaplanamadı.");
        } finally {
            btn.innerHTML = `<i class="fas fa-calculator"></i> Fiyatı Gör`;
            btn.disabled = false;
        }
    };

    // ====================== KAYA KAYA SMOOTH SCROLL ======================
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.getElementById(href.substring(1));
                if (!targetSection) return;

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight - 30;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburgerIcon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    console.log('%c🚀 BERKAN OTO KURTARMA - TAM KOD YÜKLENDİ!', 'color:#ffb703; font-size:20px; font-weight:bold');
});