// Instance-mode sketch for tab 15
registerSketch('sk15', function(p) {
    const CANVAS_SIZE = 800;

    // ─── VIEWPORT (cropped to Africa/Europe/Asia) ──────────────────────
    const VIEW_LON_MIN = -22;
    const VIEW_LON_MAX = 95;
    const VIEW_LAT_MIN = -40;
    const VIEW_LAT_MAX = 65;

    // ─── DATA ──────────────────────────────────────────────────────────
    const SA = { lat: -30.6, lon: 25.0 };

    const migrationData = {
        "Zimbabwe": {
            lat: -20.0,
            lon: 30.0,
            continent: "Africa",
            stock: { 1990: 89371, 1995: 82695, 2000: 116489, 2005: 253785, 2010: 545405, 2015: 833530, 2020: 966487, 2024: 1072620 }
        },
        "Mozambique": {
            lat: -18.7,
            lon: 35.5,
            continent: "Africa",
            stock: { 1990: 116573, 1995: 274920, 2000: 252569, 2005: 310547, 2010: 374505, 2015: 403208, 2020: 413226, 2024: 412058 }
        },
        "Lesotho": {
            lat: -29.6,
            lon: 28.6,
            continent: "Africa",
            stock: { 1990: 126222, 1995: 116921, 2000: 114876, 2005: 130208, 2010: 153913, 2015: 183120, 2020: 215957, 2024: 237718 }
        },
        "Malawi": {
            lat: -13.3,
            lon: 34.0,
            continent: "Africa",
            stock: { 1990: 19462, 1995: 12658, 2000: 20543, 2005: 43126, 2010: 73730, 2015: 121300, 2020: 177019, 2024: 220437 }
        },
        "Ethiopia": {
            lat: 9.0,
            lon: 38.7,
            continent: "Africa",
            stock: { 1990: 12, 1995: 109, 2000: 698, 2005: 11887, 2010: 22273, 2015: 72207, 2020: 117442, 2024: 104402 }
        },
        "DRC": {
            lat: -4.0,
            lon: 21.8,
            continent: "Africa",
            stock: { 1990: 2489, 1995: 5533, 2000: 11335, 2005: 40713, 2010: 34325, 2015: 68004, 2020: 77134, 2024: 57519 }
        },
        "United Kingdom": {
            lat: 51.5,
            lon: -0.1,
            continent: "Europe",
            stock: { 1990: 172669, 1995: 129494, 2000: 109384, 2005: 96154, 2010: 84527, 2015: 73706, 2020: 64089, 2024: 55144 }
        },
        "Somalia": {
            lat: 5.2,
            lon: 46.2,
            continent: "Africa",
            stock: { 1990: 12, 1995: 488, 2000: 5109, 2005: 22346, 2010: 30960, 2015: 66062, 2020: 45539, 2024: 42516 }
        },
        "Namibia": {
            lat: -22.6,
            lon: 17.1,
            continent: "Africa",
            stock: { 1990: 42066, 1995: 34641, 2000: 42502, 2005: 44041, 2010: 41269, 2015: 38929, 2020: 36795, 2024: 34273 }
        },
        "Bangladesh": {
            lat: 23.7,
            lon: 90.4,
            continent: "Asia",
            stock: { 1990: 12, 1995: 112, 2000: 433, 2005: 8537, 2010: 13432, 2015: 27930, 2020: 47821, 2024: 30637 }
        },
        "Congo": {
            lat: -4.3,
            lon: 15.3,
            continent: "Africa",
            stock: { 1990: 2352, 1995: 1774, 2000: 6019, 2005: 15501, 2010: 24231, 2015: 32296, 2020: 36235, 2024: 29093 }
        },
        "India": {
            lat: 20.6,
            lon: 79.0,
            continent: "Asia",
            stock: { 1990: 12245, 1995: 11709, 2000: 16743, 2005: 27229, 2010: 28784, 2015: 34185, 2020: 32302, 2024: 27674 }
        },
        "Nigeria": {
            lat: 9.1,
            lon: 8.7,
            continent: "Africa",
            stock: { 1990: 12, 1995: 959, 2000: 4506, 2005: 21100, 2010: 21998, 2015: 33525, 2020: 30996, 2024: 26707 }
        },
        "Zambia": {
            lat: -15.4,
            lon: 28.3,
            continent: "Africa",
            stock: { 1990: 17949, 1995: 15413, 2000: 21074, 2005: 26127, 2010: 29149, 2015: 28326, 2020: 25677, 2024: 22946 }
        },
        "Pakistan": {
            lat: 30.4,
            lon: 69.3,
            continent: "Asia",
            stock: { 1990: 436, 1995: 1259, 2000: 3536, 2005: 16242, 2010: 14252, 2015: 23267, 2020: 24913, 2024: 17393 }
        },
        "Burundi": {
            lat: -3.4,
            lon: 29.9,
            continent: "Africa",
            stock: { 1990: 12, 1995: 14, 2000: 1926, 2005: 7597, 2010: 6411, 2015: 10146, 2020: 14477, 2024: 12416 }
        },
        "Germany": {
            lat: 51.2,
            lon: 10.4,
            continent: "Europe",
            stock: { 1990: 25470, 1995: 20115, 2000: 22135, 2005: 22215, 2010: 20846, 2015: 16988, 2020: 13176, 2024: 9935 }
        },
        "Eswatini": {
            lat: -26.5,
            lon: 31.5,
            continent: "Africa",
            stock: { 1990: 30617, 1995: 27333, 2000: 28729, 2005: 31889, 2010: 35488, 2015: 26393, 2020: 16929, 2024: 9302 }
        },
        "Ghana": {
            lat: 7.9,
            lon: -1.0,
            continent: "Africa",
            stock: { 1990: 908, 1995: 1605, 2000: 3184, 2005: 5881, 2010: 7262, 2015: 10474, 2020: 9722, 2024: 8409 }
        },
        "Botswana": {
            lat: -22.3,
            lon: 24.7,
            continent: "Africa",
            stock: { 1990: 19046, 1995: 12829, 2000: 16026, 2005: 15535, 2010: 12922, 2015: 11016, 2020: 9435, 2024: 8004 }
        }
    };

    const YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

    // ─── REALISTIC MAP OUTLINES ────────────────────────────────────────
    const MAP_OUTLINES = {
        africa: [
            [-17.1, 14.7],
            [-17.6, 16.1],
            [-16.5, 19.3],
            [-16.0, 20.5],
            [-15.8, 21.3],
            [-13.0, 21.3],
            [-13.1, 22.7],
            [-12.0, 23.8],
            [-12.0, 25.0],
            [-8.7, 25.9],
            [-8.7, 27.7],
            [-3.6, 28.8],
            [-2.2, 30.0],
            [-1.8, 32.0],
            [-1.1, 32.9],
            [-1.7, 33.5],
            [-1.8, 34.7],
            [-2.2, 35.1],
            [0.0, 35.9],
            [1.2, 36.2],
            [3.0, 36.8],
            [4.8, 36.8],
            [7.5, 37.1],
            [8.6, 37.0],
            [9.5, 37.3],
            [10.1, 37.0],
            [11.1, 33.2],
            [11.6, 33.2],
            [12.3, 32.8],
            [13.3, 32.9],
            [15.2, 32.4],
            [16.6, 31.4],
            [20.0, 30.9],
            [22.0, 31.6],
            [24.9, 31.6],
            [25.2, 31.5],
            [27.0, 31.2],
            [29.2, 30.8],
            [30.3, 31.2],
            [31.0, 31.5],
            [32.1, 31.3],
            [33.2, 29.0],
            [34.2, 27.8],
            [34.9, 26.0],
            [35.2, 24.5],
            [35.8, 23.0],
            [36.5, 22.0],
            [36.9, 21.5],
            [37.3, 20.5],
            [37.8, 19.5],
            [38.5, 18.0],
            [39.2, 17.0],
            [39.8, 16.5],
            [40.3, 16.0],
            [41.0, 15.0],
            [41.8, 14.0],
            [42.4, 13.0],
            [43.0, 11.5],
            [43.4, 11.0],
            [44.0, 10.5],
            [45.0, 10.4],
            [46.0, 9.5],
            [47.0, 8.5],
            [48.0, 8.0],
            [49.0, 7.0],
            [49.5, 6.0],
            [50.5, 3.0],
            [50.8, 1.5],
            [51.0, 0.0],
            [50.5, -1.5],
            [49.0, -3.0],
            [47.5, -5.0],
            [46.0, -6.0],
            [44.0, -8.0],
            [43.0, -9.0],
            [42.0, -10.5],
            [41.0, -10.5],
            [40.5, -11.0],
            [40.0, -12.5],
            [40.5, -14.0],
            [40.5, -15.5],
            [40.0, -16.5],
            [39.0, -17.0],
            [37.5, -18.0],
            [36.0, -19.0],
            [35.5, -20.0],
            [35.3, -21.5],
            [35.5, -23.5],
            [35.3, -25.0],
            [34.5, -26.5],
            [33.0, -27.5],
            [32.5, -28.5],
            [32.0, -29.0],
            [31.0, -29.5],
            [30.0, -30.5],
            [29.0, -31.0],
            [28.0, -32.0],
            [27.0, -33.0],
            [26.0, -33.5],
            [25.0, -33.8],
            [23.0, -34.0],
            [21.0, -34.5],
            [19.5, -34.6],
            [18.5, -34.2],
            [18.1, -33.0],
            [17.8, -32.5],
            [18.0, -31.5],
            [17.5, -30.5],
            [17.0, -29.0],
            [16.5, -28.5],
            [15.5, -27.5],
            [15.0, -26.5],
            [14.5, -25.5],
            [14.5, -23.5],
            [14.5, -22.0],
            [14.0, -20.5],
            [13.5, -18.5],
            [13.0, -17.5],
            [12.5, -16.0],
            [12.0, -13.5],
            [12.0, -11.0],
            [12.5, -9.0],
            [13.0, -7.5],
            [12.5, -6.0],
            [12.0, -5.5],
            [12.0, -4.5],
            [11.5, -3.5],
            [11.0, -2.5],
            [9.8, -2.0],
            [9.5, -1.0],
            [9.3, 1.0],
            [9.6, 2.0],
            [9.8, 3.5],
            [10.0, 4.5],
            [9.5, 4.5],
            [8.5, 4.8],
            [7.5, 4.8],
            [7.0, 4.5],
            [5.0, 4.5],
            [3.5, 6.3],
            [2.7, 6.4],
            [1.5, 6.0],
            [0.5, 5.5],
            [-1.0, 5.0],
            [-2.5, 5.0],
            [-3.0, 5.0],
            [-5.0, 5.3],
            [-7.5, 4.5],
            [-8.0, 5.5],
            [-9.0, 7.5],
            [-10.5, 8.5],
            [-11.0, 8.0],
            [-12.0, 8.0],
            [-13.0, 8.5],
            [-14.0, 9.5],
            [-15.0, 10.5],
            [-16.0, 11.5],
            [-16.5, 12.0],
            [-16.7, 13.0],
            [-17.0, 14.0],
            [-17.1, 14.7]
        ],
        madagascar: [
            [49.5, -12.0],
            [50.5, -14.0],
            [50.0, -16.0],
            [49.5, -17.5],
            [49.0, -19.0],
            [48.0, -21.0],
            [47.0, -24.0],
            [46.0, -25.5],
            [45.0, -25.5],
            [44.0, -24.5],
            [43.5, -22.5],
            [44.0, -20.0],
            [44.5, -18.0],
            [44.5, -16.0],
            [46.0, -13.5],
            [47.5, -12.5],
            [49.0, -12.0],
            [49.5, -12.0]
        ],

        // ─── EUROPE (separate landmasses) ─────────────────────────────────
        // Iberian Peninsula
        iberia: [
            [-9.5, 37.0],
            [-8.9, 36.8],
            [-7.4, 37.2],
            [-5.6, 36.0],
            [-5.3, 36.2],
            [-3.0, 36.7],
            [-1.6, 36.7],
            [0.0, 37.6],
            [-0.3, 38.5],
            [0.2, 39.5],
            [0.5, 40.5],
            [1.5, 41.0],
            [2.0, 41.3],
            [3.2, 42.4],
            [3.2, 43.3],
            [1.8, 42.8],
            [0.0, 42.7],
            [-1.8, 43.4],
            [-4.5, 43.4],
            [-5.8, 43.6],
            [-7.9, 43.8],
            [-8.9, 42.5],
            [-8.8, 41.9],
            [-8.2, 41.8],
            [-6.6, 41.9],
            [-6.9, 41.0],
            [-7.4, 40.2],
            [-8.6, 40.5],
            [-9.5, 39.4],
            [-9.0, 38.7],
            [-9.5, 37.0]
        ],
        // Continental Europe (France → Poland → Balkans → Italy loop)
        europe_main: [
            // France west coast up
            [-1.2, 43.5],
            [0.0, 42.7],
            [3.2, 43.3],
            [3.0, 43.0],
            [5.0, 43.3],
            [6.2, 43.1],
            [7.5, 43.8],
            // Riviera → Italy boot west coast
            [8.2, 44.0],
            [9.0, 44.2],
            [9.8, 44.1],
            [10.0, 43.5],
            [10.5, 42.9],
            [11.1, 42.4],
            [12.2, 41.8],
            [13.5, 41.2],
            [15.1, 40.0],
            [16.0, 39.0],
            [16.5, 38.5],
            [16.0, 38.0],
            [15.6, 38.0],
            [15.6, 37.9],
            [15.2, 38.2],
            [14.0, 38.6],
            // Sicily skip — too small. Back up boot east coast
            [13.0, 38.2],
            [12.5, 37.8],
            [12.0, 37.6],
            [11.9, 38.0],
            [12.5, 38.9],
            [13.6, 39.0],
            [14.5, 40.0],
            [14.3, 40.6],
            [14.8, 40.8],
            [15.4, 41.2],
            [16.2, 41.9],
            [17.0, 41.5],
            [18.5, 40.3],
            [18.5, 40.0],
            [18.0, 39.8],
            [17.2, 40.5],
            [16.5, 41.0],
            // Across to Adriatic → Balkans coast
            [17.6, 42.7],
            [16.4, 43.0],
            [15.2, 44.2],
            [14.5, 45.0],
            [13.8, 45.5],
            // Up through Alps → Austria → Hungary → Balkans
            [14.5, 46.4],
            [16.1, 46.9],
            [17.1, 46.0],
            [18.8, 45.8],
            [19.8, 45.5],
            [20.4, 44.8],
            [21.4, 44.2],
            // Serbia → Bulgaria → Greece border → Turkey
            [22.4, 44.0],
            [22.7, 43.7],
            [23.5, 43.6],
            [25.5, 43.6],
            [27.1, 43.7],
            [28.6, 43.8],
            [28.6, 44.3],
            // Romania east → Moldova → Ukraine coast
            [29.7, 45.4],
            [30.0, 46.5],
            [31.8, 46.6],
            [33.4, 46.1],
            [34.4, 45.9],
            [35.0, 46.1],
            [36.6, 45.4],
            [38.0, 46.0],
            [39.6, 47.2],
            [40.0, 48.0],
            // Up through Ukraine into Russia (clip at top of viewport ~62)
            [38.0, 49.0],
            [36.0, 50.0],
            [33.5, 50.0],
            [31.8, 50.8],
            [30.5, 51.4],
            [28.5, 51.6],
            [24.1, 52.0],
            [23.5, 52.2],
            [21.0, 52.5],
            [18.5, 54.8],
            [18.0, 55.2],
            // Baltic states up
            [19.5, 54.4],
            [20.5, 54.5],
            [21.0, 55.7],
            [22.5, 55.7],
            [24.0, 56.9],
            [24.1, 57.6],
            [22.5, 57.8],
            [21.5, 58.5],
            [22.0, 59.5],
            [24.5, 59.4],
            [27.5, 59.5],
            [28.0, 60.3],
            // Finland
            [30.0, 60.0],
            [30.0, 61.5],
            [28.5, 63.0],
            [26.0, 64.0],
            [25.0, 65.0],
            [24.0, 65.5],
            // Scandinavian west coast south
            [21.0, 65.0],
            [18.5, 63.5],
            [16.0, 62.0],
            [14.5, 61.0],
            [12.5, 60.0],
            [11.5, 59.0],
            [10.5, 59.8],
            [9.5, 61.0],
            [7.5, 62.0],
            [5.5, 62.0],
            [5.0, 61.2],
            [5.0, 60.0],
            [6.0, 58.5],
            [7.0, 58.0],
            [8.0, 58.0],
            [8.5, 57.5],
            // Denmark peninsula (Jutland)
            [9.0, 57.0],
            [8.6, 56.5],
            [8.1, 55.6],
            [8.6, 54.9],
            [9.5, 54.8],
            [9.8, 55.3],
            [10.6, 55.4],
            [12.1, 56.1],
            [12.5, 55.7],
            [14.0, 55.4],
            // Back south along Baltic coast → Germany → Netherlands
            [14.2, 54.2],
            [13.4, 54.1],
            [12.1, 54.2],
            [11.0, 54.0],
            [10.0, 54.5],
            [9.5, 54.8],
            [8.6, 54.9],
            [8.0, 54.5],
            [7.0, 53.7],
            [5.5, 53.4],
            [4.2, 52.4],
            // Netherlands → Belgium → France north
            [3.4, 51.4],
            [2.5, 51.1],
            [1.5, 51.0],
            [1.5, 50.8],
            [2.5, 50.8],
            [4.0, 50.0],
            [5.0, 49.5],
            [6.0, 49.5],
            [7.0, 49.0],
            [8.0, 48.5],
            [7.5, 47.6],
            [6.5, 47.3],
            [6.0, 46.3],
            [5.8, 46.0],
            [4.8, 46.0],
            [4.0, 46.5],
            [3.0, 47.0],
            [2.0, 47.0],
            [1.0, 47.5],
            [0.0, 48.5],
            [-1.5, 48.5],
            [-3.0, 48.6],
            [-4.5, 48.4],
            [-4.8, 48.0],
            [-3.0, 47.8],
            [-2.5, 47.3],
            [-1.2, 46.5],
            [-1.2, 44.5],
            [-1.2, 43.5]
        ],
        // British Isles — Great Britain
        britain: [
            [-5.7, 50.1],
            [-4.2, 50.4],
            [-3.5, 50.7],
            [-1.5, 50.7],
            [0.0, 50.8],
            [1.4, 51.2],
            [1.7, 52.0],
            [1.2, 52.8],
            [0.3, 52.9],
            [-0.2, 53.5],
            [0.1, 53.7],
            [-0.3, 54.0],
            [-1.2, 54.6],
            [-1.5, 55.0],
            [-2.0, 55.8],
            [-1.7, 57.5],
            [-2.0, 57.7],
            [-3.3, 58.5],
            [-5.0, 58.6],
            [-5.3, 58.2],
            [-4.2, 57.5],
            [-5.0, 56.5],
            [-5.5, 56.3],
            [-4.5, 55.7],
            [-3.2, 55.0],
            [-3.0, 54.5],
            [-3.4, 54.0],
            [-4.3, 53.3],
            [-3.1, 53.3],
            [-3.0, 52.8],
            [-4.1, 52.6],
            [-5.0, 51.6],
            [-4.2, 51.4],
            [-3.2, 51.4],
            [-3.5, 50.6],
            [-4.7, 50.3],
            [-5.7, 50.1]
        ],
        // Ireland
        ireland: [
            [-10.5, 51.5],
            [-9.5, 51.5],
            [-8.2, 51.8],
            [-6.2, 52.2],
            [-6.0, 52.6],
            [-6.1, 53.2],
            [-5.5, 54.2],
            [-6.0, 55.0],
            [-7.0, 55.3],
            [-8.2, 55.2],
            [-10.0, 54.0],
            [-10.4, 53.5],
            [-9.5, 53.0],
            [-9.8, 52.5],
            [-10.5, 51.5]
        ],
        // Greece + southern Balkans (below main Europe polygon)
        greece: [
            [20.0, 40.0],
            [20.5, 39.8],
            [21.0, 39.0],
            [21.7, 38.3],
            [22.5, 38.0],
            [23.0, 37.6],
            [23.6, 38.0],
            [24.0, 38.7],
            [24.6, 38.5],
            [25.0, 38.4],
            [26.0, 39.1],
            [26.5, 40.0],
            [26.1, 40.7],
            [25.1, 40.9],
            [24.0, 40.7],
            [23.5, 40.5],
            [22.6, 40.5],
            [21.8, 40.9],
            [20.6, 40.5],
            [20.0, 40.0]
        ],
        // Turkey (Anatolia)
        turkey: [
            [26.0, 40.5],
            [27.5, 40.6],
            [29.0, 41.0],
            [30.5, 41.0],
            [32.0, 41.5],
            [33.5, 42.0],
            [35.0, 42.0],
            [36.5, 41.5],
            [38.0, 40.5],
            [40.0, 41.0],
            [41.0, 41.5],
            [42.5, 41.2],
            [44.0, 40.0],
            [44.5, 39.5],
            [44.0, 38.5],
            [42.5, 37.5],
            [41.0, 37.0],
            [39.0, 36.7],
            [36.5, 36.5],
            [35.0, 36.0],
            [33.5, 36.0],
            [32.0, 36.2],
            [30.5, 36.8],
            [29.0, 36.7],
            [27.5, 37.0],
            [26.5, 38.0],
            [26.0, 39.0],
            [26.0, 40.5]
        ],

        // ─── ARABIAN PENINSULA ────────────────────────────────────────────
        arabia: [
            [34.5, 29.5],
            [35.0, 29.0],
            [36.5, 29.2],
            [37.5, 27.0],
            [38.5, 24.5],
            [40.0, 22.5],
            [41.5, 19.5],
            [42.5, 17.0],
            [43.0, 15.5],
            [43.5, 13.5],
            [44.0, 12.5],
            [45.0, 12.8],
            [47.0, 14.0],
            [49.0, 16.5],
            [52.0, 19.0],
            [55.0, 22.5],
            [56.0, 24.5],
            [56.3, 25.5],
            [56.0, 26.2],
            [55.0, 26.0],
            [52.0, 24.5],
            [51.5, 24.5],
            [51.0, 25.5],
            [50.5, 26.5],
            [50.0, 28.0],
            [48.5, 29.5],
            [48.0, 30.3],
            [47.0, 30.5],
            [46.5, 29.5],
            [44.5, 29.5],
            [42.0, 31.0],
            [39.0, 32.0],
            [36.5, 32.5],
            [36.0, 31.5],
            [35.0, 31.0],
            [34.5, 29.5]
        ],

        // ─── IRAN + CENTRAL ASIA ──────────────────────────────────────────
        iran: [
            [44.5, 39.5],
            [46.0, 39.0],
            [48.0, 38.5],
            [48.5, 38.5],
            [49.0, 37.5],
            [50.5, 37.0],
            [51.5, 36.0],
            [53.0, 37.0],
            [54.5, 37.5],
            [56.0, 37.5],
            [57.5, 37.5],
            [59.5, 37.5],
            [60.5, 36.5],
            [61.0, 35.5],
            [61.5, 34.0],
            [61.0, 32.5],
            [60.5, 31.5],
            [60.0, 30.0],
            [58.0, 27.5],
            [57.0, 26.5],
            [56.5, 25.5],
            [55.0, 26.0],
            [54.0, 26.5],
            [52.5, 27.5],
            [51.0, 28.0],
            [50.0, 29.5],
            [48.5, 30.5],
            [47.5, 31.0],
            [46.0, 33.0],
            [44.5, 34.5],
            [44.0, 36.0],
            [44.0, 37.5],
            [44.0, 38.5],
            [44.5, 39.5]
        ],
        // Afghanistan + Central Asian shape (Turkmenistan, etc.)
        centralAsia: [
            [61.5, 35.0],
            [63.0, 35.5],
            [64.5, 36.5],
            [66.5, 37.5],
            [68.0, 38.5],
            [68.5, 39.5],
            [68.0, 40.0],
            [66.0, 41.0],
            [62.0, 41.5],
            [60.0, 41.5],
            [58.5, 42.0],
            [56.0, 41.5],
            [54.5, 42.0],
            [53.0, 42.5],
            [52.0, 41.5],
            [51.0, 40.5],
            [50.0, 40.0],
            [49.0, 39.5],
            [48.5, 38.5],
            [50.5, 37.0],
            [53.0, 37.0],
            [54.5, 37.5],
            [56.0, 37.5],
            [57.5, 37.5],
            [59.5, 37.5],
            [60.5, 36.5],
            [61.5, 35.0]
        ],

        // ─── SOUTH ASIA (India/Pakistan/Bangladesh subcontinent) ──────────
        southAsia: [
            // Pakistan coast up to Karakoram
            [61.5, 25.0],
            [63.0, 25.0],
            [65.0, 25.5],
            [66.5, 25.5],
            [67.0, 24.0],
            [68.0, 24.5],
            [68.5, 23.5],
            [70.0, 22.5],
            // India west coast south
            [72.0, 21.5],
            [72.8, 20.5],
            [73.0, 19.0],
            [73.0, 17.0],
            [74.5, 14.5],
            [74.8, 12.5],
            [75.8, 11.5],
            [76.5, 9.0],
            [77.5, 8.0],
            // India south tip → east coast up
            [78.0, 8.5],
            [79.5, 10.0],
            [80.0, 13.0],
            [80.3, 15.5],
            [81.5, 16.5],
            [82.5, 17.5],
            [83.5, 18.5],
            [84.5, 19.5],
            [85.5, 21.5],
            // Bay of Bengal coast → Bangladesh
            [87.0, 22.0],
            [88.0, 22.0],
            [88.5, 21.5],
            [89.0, 22.0],
            [89.0, 23.5],
            [89.5, 25.0],
            [90.5, 26.0],
            [92.0, 27.0],
            [93.0, 28.5],
            // Myanmar border clip at edge
            [95.0, 28.5],
            [96.0, 27.5],
            // Back west along Himalayas
            [95.0, 26.0],
            [92.0, 25.5],
            [91.5, 25.0],
            [90.0, 25.0],
            [89.0, 26.0],
            [88.0, 26.5],
            [87.0, 26.5],
            [85.0, 27.5],
            [83.0, 28.5],
            [81.0, 29.5],
            [80.0, 28.5],
            [78.0, 30.5],
            // Kashmir → Pakistan north
            [76.0, 32.5],
            [74.0, 34.0],
            [72.5, 35.5],
            [71.0, 36.0],
            [70.0, 35.5],
            [69.0, 34.0],
            [67.0, 31.0],
            [64.0, 29.0],
            [62.0, 26.5],
            [61.5, 25.0]
        ],
        // Sri Lanka
        sriLanka: [
            [79.7, 9.8],
            [80.0, 9.5],
            [80.5, 8.5],
            [81.0, 7.5],
            [81.8, 7.0],
            [81.9, 7.5],
            [81.5, 8.5],
            [80.8, 9.0],
            [80.2, 9.8],
            [79.7, 9.8]
        ]
    };

    // ─── LABEL OFFSETS (hand-tuned to avoid overlap) ───────────────────
    const labelOffsets = {
        "Zimbabwe": { dx: 10, dy: -2, align: "left" },
        "Mozambique": { dx: 10, dy: 0, align: "left" },
        "Lesotho": { dx: 10, dy: 8, align: "left" },
        "Malawi": { dx: 10, dy: -2, align: "left" },
        "Ethiopia": { dx: 10, dy: -2, align: "left" },
        "DRC": { dx: -10, dy: -8, align: "right" },
        "United Kingdom": { dx: -10, dy: 0, align: "right" },
        "Somalia": { dx: 10, dy: 0, align: "left" },
        "Namibia": { dx: -10, dy: 0, align: "right" },
        "Bangladesh": { dx: 8, dy: -8, align: "left" },
        "Congo": { dx: -10, dy: 0, align: "right" },
        "India": { dx: 10, dy: 5, align: "left" },
        "Nigeria": { dx: -10, dy: -5, align: "right" },
        "Zambia": { dx: -10, dy: -2, align: "right" },
        "Pakistan": { dx: 10, dy: -5, align: "left" },
        "Burundi": { dx: 10, dy: 5, align: "left" },
        "Germany": { dx: 10, dy: 0, align: "left" },
        "Eswatini": { dx: 10, dy: 5, align: "left" },
        "Ghana": { dx: -10, dy: 5, align: "right" },
        "Botswana": { dx: -10, dy: 5, align: "right" }
    };

    const YEARS_LIST = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];

    // ─── STATE ─────────────────────────────────────────────────────────
    let currentYearIndex = 7;
    let hoveredCountry = null;
    let animProgress = {};
    let totalForYear = 0;

    // ─── COLORS ────────────────────────────────────────────────────────
    const COL_BG = [15, 18, 25];
    const COL_LAND = [40, 48, 62];
    const COL_LAND_STR = [55, 65, 82];
    const COL_SA_FILL = [70, 60, 30];
    const COL_SA = [255, 200, 50];
    const COL_AFRICA = [230, 80, 60];
    const COL_EUROPE = [80, 160, 230];
    const COL_ASIA = [80, 220, 160];
    const COL_TEXT = [220, 225, 235];
    const COL_DIM = [120, 130, 145];

    // ─── HELPERS ───────────────────────────────────────────────────────
    function lonToX(lon) {
        return p.map(lon, VIEW_LON_MIN, VIEW_LON_MAX, CANVAS_SIZE * 0.03, CANVAS_SIZE * 0.97);
    }

    function latToY(lat) {
        return p.map(lat, VIEW_LAT_MAX, VIEW_LAT_MIN, CANVAS_SIZE * 0.12, CANVAS_SIZE * 0.85);
    }

    function getColor(c) {
        if (c === "Africa") return COL_AFRICA;
        if (c === "Europe") return COL_EUROPE;
        return COL_ASIA;
    }

    function shortName(n) {
        if (n === "United Kingdom") return "UK";
        return n;
    }

    // ─── SETUP ─────────────────────────────────────────────────────────
    p.setup = function() {
        p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
        for (let n in migrationData) animProgress[n] = 0;
        p.textFont("monospace");
        p.frameRate(30);
    };

    // ─── DRAW ──────────────────────────────────────────────────────────
    p.draw = function() {
        p.background(COL_BG);
        let year = YEARS_LIST[currentYearIndex];

        totalForYear = 0;
        for (let n in migrationData) totalForYear += migrationData[n].stock[year] || 0;

        drawMap();
        drawFlowArrows(year);
        drawSAMarker();
        drawOriginDots(year);
        drawTitle(year);
        drawSlider();
        drawLegend();
        drawTooltip(year);
        drawInset(year);
        drawSource();

        // Frame
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, p.width - 1, p.height - 1);
    };

    // ─── MAP ───────────────────────────────────────────────────────────
    function drawMap() {
        for (let region in MAP_OUTLINES) {
            let pts = MAP_OUTLINES[region];
            p.fill(COL_LAND);
            p.stroke(COL_LAND_STR);
            p.strokeWeight(0.6);
            p.beginShape();
            for (let pt of pts) {
                p.vertex(lonToX(pt[0]), latToY(pt[1]));
            }
            p.endShape(p.CLOSE);
        }
    }

    // ─── SA MARKER ─────────────────────────────────────────────────────
    function drawSAMarker() {
        let sx = lonToX(SA.lon);
        let sy = latToY(SA.lat);

        let pulse = p.sin(p.frameCount * 0.05) * 0.3 + 0.7;
        p.noStroke();
        for (let r = 35; r > 0; r -= 4) {
            p.fill(COL_SA[0], COL_SA[1], COL_SA[2], pulse * (35 - r) * 0.7);
            p.ellipse(sx, sy, r, r);
        }

        p.fill(COL_SA);
        p.noStroke();
        p.ellipse(sx, sy, 12, 12);

        p.fill(COL_SA);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(11);
        p.textStyle(p.BOLD);
        p.text("SOUTH AFRICA", sx, sy + 16);
        p.textStyle(p.NORMAL);
    }

    // ─── FLOW ARROWS ──────────────────────────────────────────────────
    function drawFlowArrows(year) {
        let sx = lonToX(SA.lon);
        let sy = latToY(SA.lat);

        // Compute min and max stock for THIS year across all visible countries
        let minStock = Infinity;
        let maxStock = 0;
        for (let n in migrationData) {
            let s = migrationData[n].stock[year] || 0;
            if (s < 50) continue;
            if (s > maxStock) maxStock = s;
            if (s < minStock) minStock = s;
        }
        if (maxStock === 0) return;
        if (minStock === Infinity) minStock = 0;

        for (let name in migrationData) {
            let d = migrationData[name];
            let stock = d.stock[year] || 0;
            if (stock < 50) continue;

            let ox = lonToX(d.lon);
            let oy = latToY(d.lat);

            // Thickness proportional to this year's min–max range
            let thickness = (minStock === maxStock) ?
                14 :
                p.map(stock, minStock, maxStock, 2.0, 32);
            let col = getColor(d.continent);

            if (animProgress[name] < 1) {
                animProgress[name] += 0.025;
                animProgress[name] = p.min(animProgress[name], 1);
            }
            let prog = animProgress[name];

            // Curve control
            let midX = (ox + sx) / 2;
            let midY = (oy + sy) / 2;
            let perpX = -(sy - oy) * 0.12;
            let perpY = (sx - ox) * 0.12;
            let cx = midX + perpX;
            let cy = midY + perpY;

            // Flow line
            p.noFill();
            p.stroke(col[0], col[1], col[2], 120 * prog);
            p.strokeWeight(thickness);
            p.bezier(ox, oy, cx, cy, cx, cy, sx, sy);

            // Particles — count and size also scaled to year's min–max
            if (stock > 500) {
                let numP = p.floor(p.map(stock, minStock, maxStock, 2, 10));
                numP = p.constrain(numP, 2, 10);
                for (let i = 0; i < numP; i++) {
                    let t = ((p.frameCount * 0.007 + i * (1.0 / numP)) % 1.0);
                    let px = p.bezierPoint(ox, cx, cx, sx, t);
                    let py = p.bezierPoint(oy, cy, cy, sy, t);
                    let ps = p.map(stock, minStock, maxStock, 2, 6);
                    p.noStroke();
                    p.fill(col[0], col[1], col[2], 220);
                    p.ellipse(px, py, ps, ps);
                }
            }
        }
    }

    // ─── ORIGIN DOTS + LABELS ─────────────────────────────────────────
    function drawOriginDots(year) {
        hoveredCountry = null;

        for (let name in migrationData) {
            let d = migrationData[name];
            let stock = d.stock[year] || 0;
            if (stock < 50) continue;

            let ox = lonToX(d.lon);
            let oy = latToY(d.lat);
            let col = getColor(d.continent);

            if (p.dist(p.mouseX, p.mouseY, ox, oy) < 18) hoveredCountry = name;

            let isHover = hoveredCountry === name;
            let dotSize = isHover ? 12 : 8;

            // Bright glow behind dot
            p.noStroke();
            p.fill(col[0], col[1], col[2], 60);
            p.ellipse(ox, oy, dotSize + 12, dotSize + 12);
            p.fill(col[0], col[1], col[2], 120);
            p.ellipse(ox, oy, dotSize + 5, dotSize + 5);

            // Bright solid dot
            p.fill(col[0], col[1], col[2], 255);
            p.ellipse(ox, oy, dotSize, dotSize);

            // White core for extra brightness
            p.fill(255, 255, 255, isHover ? 180 : 80);
            p.ellipse(ox, oy, dotSize * 0.4, dotSize * 0.4);

            // ALWAYS show label for every country (consistent across years)
            let off = labelOffsets[name] || { dx: 10, dy: 0, align: "left" };
            let labelAlpha = stock > 10000 ? 240 : 140;
            p.fill(COL_TEXT[0], COL_TEXT[1], COL_TEXT[2], labelAlpha);
            p.textSize(9);
            p.textStyle(stock > 50000 || isHover ? p.BOLD : p.NORMAL);
            if (off.align === "right") {
                p.textAlign(p.RIGHT, p.CENTER);
            } else {
                p.textAlign(p.LEFT, p.CENTER);
            }
            p.text(shortName(name), ox + off.dx, oy + off.dy);
        }
    }

    // ─── TITLE ─────────────────────────────────────────────────────────
    function drawTitle(year) {
        p.fill(COL_TEXT);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(17);
        p.textStyle(p.BOLD);
        p.text("Where Are South Africa's Immigrants Coming From?", 24, 16);

        p.textStyle(p.NORMAL);
        p.textSize(10);
        p.fill(COL_DIM);
        p.text("Foreign-born population by country of origin — " + year, 24, 38);

        p.fill(COL_SA);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.text("Total: " + p.nfc(totalForYear) + " immigrants", 24, 54);
        p.textStyle(p.NORMAL);
    }

    // ─── SLIDER ────────────────────────────────────────────────────────
    function drawSlider() {
        let slX = CANVAS_SIZE * 0.10;
        let slW = CANVAS_SIZE * 0.80;
        let slY = CANVAS_SIZE * 0.92;

        // Track — thicker and brighter
        p.stroke(80, 90, 110);
        p.strokeWeight(3);
        p.line(slX, slY, slX + slW, slY);

        for (let i = 0; i < YEARS_LIST.length; i++) {
            let x = slX + (i / (YEARS_LIST.length - 1)) * slW;
            let isActive = (i === currentYearIndex);

            // Tick marks — taller and brighter
            p.stroke(isActive ? COL_SA : [180, 185, 200]);
            p.strokeWeight(isActive ? 2.5 : 1.5);
            p.line(x, slY - 8, x, slY + 8);

            // Year labels — much larger and brighter
            p.noStroke();
            p.fill(isActive ? COL_SA : [200, 205, 215]);
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(isActive ? 14 : 12);
            p.textStyle(p.BOLD);
            p.text(YEARS_LIST[i], x, slY + 14);
        }

        // Current position dot — bigger with glow
        let curX = slX + (currentYearIndex / (YEARS_LIST.length - 1)) * slW;
        p.noStroke();
        p.fill(COL_SA[0], COL_SA[1], COL_SA[2], 50);
        p.ellipse(curX, slY, 30, 30);
        p.fill(COL_SA[0], COL_SA[1], COL_SA[2], 120);
        p.ellipse(curX, slY, 24, 24);
        p.fill(COL_SA);
        p.ellipse(curX, slY, 18, 18);
        p.fill(255, 255, 255, 150);
        p.ellipse(curX, slY, 6, 6);
    }

    // ─── LEGEND ────────────────────────────────────────────────────────
    function drawLegend() {
        let lx = CANVAS_SIZE * 0.78;
        let ly = 16;
        let sp = 22;

        p.noStroke();
        p.fill(20, 25, 35, 210);
        p.rect(lx - 10, ly - 6, 150, sp * 4 + 4, 4);

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(9);
        p.textStyle(p.BOLD);
        p.fill(COL_TEXT);
        p.text("ORIGIN REGION", lx + 2, ly + 8);
        p.textStyle(p.NORMAL);

        let items = [
            { label: "Africa", col: COL_AFRICA },
            { label: "Europe", col: COL_EUROPE },
            { label: "Asia", col: COL_ASIA }
        ];
        for (let i = 0; i < items.length; i++) {
            let y = ly + sp * (i + 1) + 4;
            p.fill(items[i].col);
            p.noStroke();
            p.ellipse(lx + 8, y, 8, 8);
            p.fill(COL_TEXT);
            p.textSize(9);
            p.text(items[i].label, lx + 18, y);
        }
    }

    // ─── TOOLTIP ───────────────────────────────────────────────────────
    function drawTooltip(year) {
        if (!hoveredCountry) return;
        let d = migrationData[hoveredCountry];
        let stock = d.stock[year] || 0;

        let tw = 175;
        let th = 52;
        let tx = p.mouseX + 15;
        let ty = p.mouseY - 35;
        if (tx + tw > CANVAS_SIZE - 5) tx = p.mouseX - tw - 10;
        if (ty < 10) ty = p.mouseY + 15;

        p.noStroke();
        p.fill(20, 25, 35, 235);
        p.rect(tx, ty, tw, th, 5);

        p.fill(COL_TEXT);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.text(shortName(hoveredCountry), tx + 12, ty + 8);

        p.textStyle(p.NORMAL);
        p.textSize(11);
        p.fill(COL_SA);
        p.text(p.nfc(stock) + " immigrants", tx + 12, ty + 28);
    }

    // ─── INSET MAP (zoomed southern Africa) ──────────────────────────
    // Tighter zoom: southern Africa from ~Zambia/Malawi down
    const INSET_LON_MIN = 14;
    const INSET_LON_MAX = 38;
    const INSET_LAT_MIN = -36;
    const INSET_LAT_MAX = -12;
    const INSET_X = CANVAS_SIZE * 0.62;
    const INSET_Y = CANVAS_SIZE * 0.52;
    const INSET_W = CANVAS_SIZE * 0.35;
    const INSET_H = CANVAS_SIZE * 0.33;

    function insetLonToX(lon) {
        return INSET_X + p.map(lon, INSET_LON_MIN, INSET_LON_MAX, 8, INSET_W - 8);
    }

    function insetLatToY(lat) {
        return INSET_Y + p.map(lat, INSET_LAT_MAX, INSET_LAT_MIN, 8, INSET_H - 8);
    }

    // Track inset hover separately
    let insetHovered = null;

    function drawInset(year) {
        // Background panel
        p.fill(10, 12, 20, 240);
        p.stroke(COL_SA[0], COL_SA[1], COL_SA[2], 140);
        p.strokeWeight(1.5);
        p.rect(INSET_X, INSET_Y, INSET_W, INSET_H, 4);

        // Clip region
        p.drawingContext.save();
        p.drawingContext.beginPath();
        p.drawingContext.rect(INSET_X + 1, INSET_Y + 1, INSET_W - 2, INSET_H - 2);
        p.drawingContext.clip();

        // Draw africa + madagascar outlines
        for (let region in MAP_OUTLINES) {
            if (region !== "africa" && region !== "madagascar") continue;
            let pts = MAP_OUTLINES[region];
            p.fill(COL_LAND[0], COL_LAND[1], COL_LAND[2], 180);
            p.stroke(COL_LAND_STR[0], COL_LAND_STR[1], COL_LAND_STR[2], 200);
            p.strokeWeight(1.0);
            p.beginShape();
            for (let pt of pts) {
                p.vertex(insetLonToX(pt[0]), insetLatToY(pt[1]));
            }
            p.endShape(p.CLOSE);
        }

        // SA marker in inset
        let isx = insetLonToX(SA.lon);
        let isy = insetLatToY(SA.lat);
        p.noStroke();
        let pulse = p.sin(p.frameCount * 0.05) * 0.3 + 0.7;
        p.fill(COL_SA[0], COL_SA[1], COL_SA[2], pulse * 30);
        p.ellipse(isx, isy, 24, 24);
        p.fill(COL_SA[0], COL_SA[1], COL_SA[2], 60);
        p.ellipse(isx, isy, 14, 14);
        p.fill(COL_SA);
        p.ellipse(isx, isy, 8, 8);
        p.fill(COL_SA);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(7);
        p.textStyle(p.BOLD);
        p.text("SA", isx, isy + 8);

        // Compute min/max for this year
        let minStock = Infinity;
        let maxStock = 0;
        for (let n in migrationData) {
            let s = migrationData[n].stock[year] || 0;
            if (s < 50) continue;
            if (s > maxStock) maxStock = s;
            if (s < minStock) minStock = s;
        }
        if (minStock === Infinity) minStock = 0;

        // Reset inset hover
        insetHovered = null;
        let mouseInInset = (p.mouseX >= INSET_X && p.mouseX <= INSET_X + INSET_W &&
            p.mouseY >= INSET_Y && p.mouseY <= INSET_Y + INSET_H);

        // Draw ALL countries — lines from outside will be clipped at boundary
        for (let name in migrationData) {
            let d = migrationData[name];
            let stock = d.stock[year] || 0;
            if (stock < 50) continue;

            // Map origin to inset coords (even if outside visible area)
            let ox = insetLonToX(d.lon);
            let oy = insetLatToY(d.lat);
            let col = getColor(d.continent);
            let prog = animProgress[name] || 1;

            // Is this country's dot within the inset visible area?
            let dotVisible = (d.lat <= INSET_LAT_MAX && d.lat >= INSET_LAT_MIN &&
                d.lon >= INSET_LON_MIN && d.lon <= INSET_LON_MAX);

            // Flow line — drawn for ALL countries, clipped by canvas clip region
            let thickness = (minStock === maxStock) ?
                5 :
                p.map(stock, minStock, maxStock, 1.5, 14);

            let midX = (ox + isx) / 2;
            let midY = (oy + isy) / 2;
            let perpX = -(isy - oy) * 0.10;
            let perpY = (isx - ox) * 0.10;
            let cx = midX + perpX;
            let cy = midY + perpY;

            p.noFill();
            p.stroke(col[0], col[1], col[2], 110 * prog);
            p.strokeWeight(thickness);
            p.bezier(ox, oy, cx, cy, cx, cy, isx, isy);

            // Particles
            if (stock > 500) {
                let numP = p.floor(p.map(stock, minStock, maxStock, 1, 6));
                numP = p.constrain(numP, 1, 6);
                for (let i = 0; i < numP; i++) {
                    let t = ((p.frameCount * 0.007 + i * (1.0 / numP)) % 1.0);
                    let px = p.bezierPoint(ox, cx, cx, isx, t);
                    let py = p.bezierPoint(oy, cy, cy, isy, t);
                    p.noStroke();
                    p.fill(col[0], col[1], col[2], 220);
                    p.ellipse(px, py, 3, 3);
                }
            }

            // Only draw dot + label + hover if the country is within the zoomed viewport
            if (dotVisible) {
                // Hover detection in inset
                if (mouseInInset && p.dist(p.mouseX, p.mouseY, ox, oy) < 14) {
                    insetHovered = name;
                }

                let isHover = (insetHovered === name);
                let dotSz = isHover ? 10 : 6;

                // Glow
                p.noStroke();
                p.fill(col[0], col[1], col[2], 60);
                p.ellipse(ox, oy, dotSz + 10, dotSz + 10);
                p.fill(col[0], col[1], col[2], 140);
                p.ellipse(ox, oy, dotSz + 4, dotSz + 4);
                // Solid dot
                p.fill(col[0], col[1], col[2], 255);
                p.ellipse(ox, oy, dotSz, dotSz);
                p.fill(255, 255, 255, isHover ? 160 : 60);
                p.ellipse(ox, oy, dotSz * 0.35, dotSz * 0.35);

                // Label
                p.fill(COL_TEXT[0], COL_TEXT[1], COL_TEXT[2], 230);
                p.noStroke();
                p.textSize(8);
                p.textStyle(isHover ? p.BOLD : p.NORMAL);
                p.textAlign(p.LEFT, p.CENTER);
                p.text(shortName(name), ox + 8, oy);
            }
        }

        // Inset tooltip
        if (insetHovered) {
            let hd = migrationData[insetHovered];
            let hs = hd.stock[year] || 0;
            let hx = insetLonToX(hd.lon);
            let hy = insetLatToY(hd.lat);

            let tw = 130;
            let th = 36;
            let tx = hx + 14;
            let ty = hy - th - 4;
            // Keep tooltip inside inset bounds
            if (tx + tw > INSET_X + INSET_W - 4) tx = hx - tw - 14;
            if (ty < INSET_Y + 16) ty = hy + 10;

            p.fill(15, 18, 28, 240);
            p.stroke(COL_SA[0], COL_SA[1], COL_SA[2], 100);
            p.strokeWeight(1);
            p.rect(tx, ty, tw, th, 3);

            p.noStroke();
            p.fill(COL_TEXT);
            p.textAlign(p.LEFT, p.TOP);
            p.textSize(8);
            p.textStyle(p.BOLD);
            p.text(insetHovered, tx + 6, ty + 5);
            p.textStyle(p.NORMAL);
            p.fill(COL_SA);
            p.textSize(8);
            p.text(p.nfc(hs) + " immigrants", tx + 6, ty + 18);
        }

        p.drawingContext.restore();

        // Inset title (outside clip so it's always visible)
        p.noStroke();
        p.fill(COL_SA);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(9);
        p.textStyle(p.BOLD);
        p.text("SOUTHERN AFRICA (DETAIL)", INSET_X + 8, INSET_Y + 6);
        p.textStyle(p.NORMAL);
    }

    // ─── SOURCE ────────────────────────────────────────────────────────
    function drawSource() {
        p.fill(COL_DIM);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.textSize(7);
        p.textStyle(p.NORMAL);
        p.text(
            "Source: UN DESA, International Migrant Stock 2024  |  CC BY 3.0 IGO",
            24, CANVAS_SIZE - 6
        );
    }

    // ─── INTERACTION ───────────────────────────────────────────────────
    p.mousePressed = function() {
        let slX = CANVAS_SIZE * 0.10;
        let slW = CANVAS_SIZE * 0.80;
        let slY = CANVAS_SIZE * 0.92;

        if (p.abs(p.mouseY - slY) < 28 && p.mouseX > slX - 20 && p.mouseX < slX + slW + 20) {
            let best = 0;
            let bestD = Infinity;
            for (let i = 0; i < YEARS_LIST.length; i++) {
                let x = slX + (i / (YEARS_LIST.length - 1)) * slW;
                let d = p.abs(p.mouseX - x);
                if (d < bestD) {
                    bestD = d;
                    best = i;
                }
            }
            if (best !== currentYearIndex) {
                currentYearIndex = best;
                for (let n in animProgress) animProgress[n] = 0;
            }
        }
    };

    p.windowResized = function() { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});