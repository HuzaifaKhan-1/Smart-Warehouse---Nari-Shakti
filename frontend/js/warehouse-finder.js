async function loadWarehouses() {

    try {

        const res = await fetch("http://127.0.0.1:8000/warehouses");

        const data = await res.json();

        const tableBody = document.getElementById("warehouseTableBody");

        tableBody.innerHTML = "";

        data.forEach(w => {

            const row = `
            <tr>
                <td>${w.name}</td>
                <td>${w.distance} km</td>
                <td>${w.crop}</td>
                <td>${w.vacancy}%</td>
                <td>₹${w.price}</td>
                <td>${w.temp}°C</td>
                <td>${w.risk}%</td>
                <td>${w.status}</td>
                <td>
                    <button class="book-btn">Book</button>
                </td>
            </tr>
            `;

            tableBody.innerHTML += row;

        });

    } catch (err) {
        console.error("Warehouse loading failed", err);
    }

}

WH = [
    {
        id: 1,
        name: "Kolhapur Cold Store",
        city: "Kolhapur",
        dist: 65,
        crop: "Tomato",
        vacancy: 40,
        price: 160,
        temp: 12,
        tempOk: true,
        risk: 8,
        status: "avail",
        zones: [
            { n: "A1", s: "avail" },
            { n: "A2", s: "avail" },
            { n: "B1", s: "filling" }
        ],
        prices: { Tomato: 160, Onion: 150 },
        aiText: "Recommended warehouse"
    }
]

renderTable()

window.onload = loadWarehouses;