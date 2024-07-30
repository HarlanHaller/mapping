mapboxgl.accessToken = "pk.eyJ1IjoiaGhhbGxlciIsImEiOiJja3oxaW14NWMwazdtMnBxZncyN3ZvdXJtIn0.4Nhz-TVFWOIovF-eS84oLw";

const urlPrams = new URLSearchParams(window.location.search);
let field = urlPrams.get('data');

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [-70.14, 43.78], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});

function run() {
    let res;
    let sw = field || prompt("which data set");
    switch (sw) {
        case "":
            return;
        case null:
            return;
        case "1":
            H();
            break;
        case "2":
            L1();
            break;
        case "3":
            L2();
            break;
        case "4":
            setTimeout(L3, 1000);
            break;
        case "5":
            L4();
            break;
        default:
            alert("Invalid Selection");
            run();
            break;
    }
}


function H() {
    fetch("/api/getData").then(res => res.json()).then(data => {
        let h = 0;
        let step = 320 / data.length;
        // console.log(data);
        for (row of data) {
            h += step;
            if (row.Fix === "1") {
                // console.log(row);
                new mapboxgl.Marker({
                    color: hslToHex(h, 80, 50)
                })
                    .setLngLat([row.Longitude * (row["E/W"] === "W" ? -1 : 1), row.Latitude * (row["N/S"] === "S" ? -1 : 1)])
                    .setPopup(new mapboxgl.Popup().setText(row.Time))
                    .addTo(map);
                console.log(h);
            }
        }
    });
}

function L1() {
    fetch("/api/getLydiaData").then(res => res.json()).then(data => {
        let h = 0;
        let step = 320 / data.length;
        // console.log(data);
        for (row of data) {
            h += step;
            if (row.longitude !== '0.00000000') {
                // console.log(row);
                new mapboxgl.Marker({
                    color: hslToHex(h, 80, 50)
                })
                    .setLngLat([row.longitude, row.latitude])
                    .setPopup(new mapboxgl.Popup().setText(row.time))
                    .addTo(map);
                console.log(h);
            }
        }
    });
}

function L2() {
    fetch("/api/getLydiaData2").then(res => res.json()).then(data => {
        let h = 0;
        let step = 320 / data.length;
        // console.log(data);
        for (row of data) {
            h += step;
            // console.log(row);
            new mapboxgl.Marker({
                color: hslToHex(h, 80, 50)
            })
                .setLngLat([row.longitude, row.latitude])
                // .setPopup(new mapboxgl.Popup().setText(row.Time))
                .addTo(map);
            // console.log(h);
        }
    });
}

function L3() {
    fetch("/api/getLydiaData2").then(res => res.json()).then(data => {
        let h = 0;
        let step = 320 / data.length;
        let i = 0;
        // console.log(data);
        let intr = setInterval(() => {
            let row = data[i];
            h += step;
            // console.log(row);
            new mapboxgl.Marker({
                color: hslToHex(h, 80, 50)
            })
                .setLngLat([row.longitude, row.latitude])
                // .setPopup(new mapboxgl.Popup().setText(row.Time))
                .addTo(map);
            // console.log(h);
            i++;
            if (i === data.length) {
                clearInterval(intr);
            }
        }, 20);
    });
}

function L4() {
    fetch("/api/getLydiaData2").then(res => res.json()).then(data => {
        let h = 0;
        let step = 320 / data.length;
        let i = 0;
        let last;
        // mark.addTo(map);
        // console.log(data);
        let intr = setInterval(() => {
            let row = data[i];
            h += step;
            if (last !== undefined) {
                last.remove();
            }
            last = new mapboxgl.Marker({color: hslToHex(h, 80, 50)})
                .setLngLat([row.longitude, row.latitude])
                .addTo(map);
            // console.log(h);
            i++;
            if (i === data.length) {
                clearInterval(intr);
            }
        }, 20);
    });
}

// const marker = new mapboxgl.Marker({
//     color: "#FFFFFF"
// }).setLngLat([-70.176346, 43.796806])
//     .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
//     .addTo(map);

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

console.log(hslToHex(320, 80, 50));

run();