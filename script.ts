// Rozhranie policka
interface Tile {
    x: number,
    y: number,
    isBomb: boolean
}

// Funkcie
const randIndex = <T>(arr: T[]) => {
    return Math.floor(Math.random() * arr.length);
}

const getAdjanced = (tiles: Tile[], tile: Tile, width: number, height: number) => {
    const adjanced: Tile[] = [];

    /* Vlavo hore  */ if(tile.x > 0 && tile.y > 0) adjanced.push(tiles.find(t => t.x === tile.x - 1 && t.y === tile.y - 1)!);
    /* Hore        */ if(tile.y > 0) adjanced.push(tiles.find(t => t.x === tile.x && t.y === tile.y - 1)!);
    /* Vpravo hore */ if(tile.x < (width - 1) && tile.y > 0) adjanced.push(tiles.find(t => t.x === tile.x + 1 && t.y === tile.y - 1)!);
    /* Vlavo       */ if(tile.x > 0) adjanced.push(tiles.find(t => t.x === tile.x - 1 && t.y === tile.y)!);
    /* Vpravo      */ if(tile.x < (width - 1)) adjanced.push(tiles.find(t => t.x === tile.x + 1 && t.y === tile.y)!);
    /* Vlavo dole  */ if(tile.x > 0 && tile.y < (height - 1)) adjanced.push(tiles.find(t => t.x === tile.x - 1 && t.y === tile.y + 1)!);
    /* Dole        */ if(tile.y < (height - 1)) adjanced.push(tiles.find(t => t.x === tile.x && t.y === tile.y + 1)!);
    /* Vpravo dole */ if(tile.x < (width - 1) && tile.y < (height - 1)) adjanced.push(tiles.find(t => t.x === tile.x + 1 && t.y === tile.y + 1)!);

    return adjanced;
}

const clicked = (button: HTMLButtonElement) => {
    if(!button.id.includes(",")) return;
    if(button.innerHTML === `<i class="fa fa-flag"></i>`) return;

    const [x, y] = button.id.split(",");

    const tile = tiles.find(t => t.x === Number(x) && t.y === Number(y));
    if(!tile) return;

    const adjanced = getAdjanced(tiles, tile, width, height);

    if(button.classList.contains("clicked")) {
        if(tile.isBomb) return;
        if(button.innerHTML === "&nbsp;") return;

        const flags = adjanced.filter(t => document.getElementById(`${t.x},${t.y}`)!.innerHTML === `<i class="fa fa-flag"></i>`);
        if(Number(button.innerHTML) === flags.length) {
            for(const adjancedTile of adjanced.filter(t => document.getElementById(`${t.x},${t.y}`)!.innerHTML !== `<i class="fa fa-flag"></i>` && !document.getElementById(`${t.x},${t.y}`)!.classList.contains("clicked"))) {
                const adjancedButton = document.getElementById(`${adjancedTile.x},${adjancedTile.y}`) as HTMLButtonElement;
                clicked(adjancedButton);
            }
        }
    } else {
        button.classList.add("clicked");

        if(tile.isBomb) {
            button.innerHTML = `<i class="fa fa-bomb"></i>`;
        } else {
            let bombsAround = adjanced.filter(t => t.isBomb).length;

            if(bombsAround) {
                button.innerHTML = String(bombsAround);
            } else {
                for(const adjancedTile of adjanced.filter(t => !document.getElementById(`${t.x},${t.y}`)!.classList.contains("clicked"))) {
                    const adjancedButton = document.getElementById(`${adjancedTile.x},${adjancedTile.y}`) as HTMLButtonElement;
                    clicked(adjancedButton);
                }
            }
        }
    }
}

const flagged = (button: HTMLButtonElement) => {
    if(button.classList.contains("clicked")) return;

    if(button.innerHTML === `<i class="fa fa-flag"></i>`) {
        button.innerHTML = "&nbsp;";
    } else {
        if(button.innerHTML !== `<i class="fa fa-bomb"></i>`) {
            button.innerHTML = `<i class="fa fa-flag"></i>`;
        }
    }
}

// Konstanty
const tiles: Tile[] = [];

const width = 10;
const height = 10;
const bombAmount = 10;

// Inicializacia pola
for(let i = 0; i < 10; ++i) {
    for(let j = 0; j < 10; ++j) {
        tiles.push({
            x: j,
            y: i,
            isBomb: false
        });
    }
}

// Vytvorenie bomb
for(let i = 0; i < bombAmount; ++i) {
    tiles[randIndex(tiles)].isBomb = true;
}

// Pridanie pola do HTML
let i = 0;

for(const tile of tiles) {
    const button = document.createElement("button");

    button.id = `${tile.x},${tile.y}`;
    button.innerHTML = "&nbsp;";

    button.onclick = (e) => clicked(<HTMLButtonElement> e.target);
    button.addEventListener("contextmenu", (e) => { 
        flagged(<HTMLButtonElement> e.target);
        e.preventDefault(); 
    }, false);

    document.body.appendChild(button);

    if(++i / width === 1) {
        document.body.appendChild(document.createElement("br"));
        i = 0;
    }
}