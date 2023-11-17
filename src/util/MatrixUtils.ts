type Matrix = number[][];

export function generateSparseArray(): Matrix {
    const matrix: Matrix = [];
    const possibleValues = [0, 1, 2];
    const centerIndex = 1;

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            if (i === centerIndex && j === centerIndex) {
                let value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                let tries = 0;
                const maxTries = 10;

                
                while (
                    (matrix[i - 1][j] === value || matrix[i][j - 1] === value || matrix[i + 1]?.[j] === value || matrix[i]?.[j + 1] === value) &&
                    tries < maxTries
                ) {
                    value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                    tries++;
                }

                if (tries === maxTries) {
                    
                    value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                }

                matrix[i][j] = value;
            } else {
                matrix[i][j] = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            }
        }
    }

    return matrix;
}

export function getTotalMultiplier(matrix: number[][]) {
    let multipliers: { [key: number]: number } = {
        0: 0,
        1: 2,
        2: 3,
    };

    let multiplier = 0;

    let horizontal = (matrix[1][1] == matrix[1][0] && matrix[1][1] == matrix[1][2]);
    let vertical = (matrix[1][1] == matrix[0][1] && matrix[1][1] == matrix[2][1]);
    let diagonalLtR = (matrix[1][1] == matrix[0][0] && matrix[1][1] == matrix[2][2]);
    let diagonalRtL = (matrix[1][1] == matrix[0][2] && matrix[1][1] == matrix[2][0]);

    if (horizontal) multiplier += multipliers[matrix[1][1]];
    if (vertical) multiplier += multipliers[matrix[1][1]];
    if (diagonalLtR) multiplier += multipliers[matrix[1][1]];
    if (diagonalRtL) multiplier += multipliers[matrix[1][1]];

    return multiplier;
}


export function generateNeverMatchedArray(): Matrix {
    const matrix: Matrix = [];
    const possibleValues = [0, 1, 2];
    const centerIndex = 1;

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            // Valor central
            if (i === centerIndex && j === centerIndex) {
                matrix[i][j] = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            } else {
                let value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                let tries = 0;
                const maxTries = 100; // Aumentamos o número de tentativas

                // Verifica se há sequências nas direções a partir do centro
                while (
                    (i === centerIndex && matrix[i]?.[j - 1] === value && matrix[i]?.[j - 2] === value) || // Horizontal
                    (j === centerIndex && matrix[i - 1]?.[j] === value && matrix[i - 2]?.[j] === value) || // Vertical
                    (i === centerIndex - 1 && j === centerIndex - 1 && matrix[i + 1]?.[j + 1] === value && matrix[i + 2]?.[j + 2] === value) || // Diagonal
                    (i === centerIndex - 1 && j === centerIndex + 1 && matrix[i + 1]?.[j - 1] === value && matrix[i + 2]?.[j - 2] === value) // Diagonal
                ) {
                    value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                    tries++;

                    if (tries === maxTries) {
                        // Se excedeu o número de tentativas, reinicia a verificação
                        i = 0;
                        j = 0;
                        tries = 0;
                        matrix.forEach(row => row.fill(-1)); // Limpa a matriz
                    }
                }

                matrix[i][j] = value;
            }
        }
    }

    return matrix;
}



export function sortJackpotArray() {
    const random = Math.random() * 100;

    if (random < 70) {
        let arr: number[];
        do {
            
            arr = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];

        } while (arr[0] === arr[1] && arr[1] === arr[2]);

        return arr;

    } else if (random < 85) {
        return [0, 0, 0];

    } else if (random < 95) {
        return [1, 1, 1];

    } else {
        return [2, 2, 2];

    }
}


export function getJackpotOperation(arr: number[]): "win" | "defeat" | "removePoints" {
    const uniqueItems = new Set(arr);

    if (uniqueItems.size === 1) {
        const item = arr[0];
        if (item === 0) {
            return "win"; 
        } else if (item === 1) {
            return "defeat"; 
        } else if (item === 2) {
            return "removePoints";
        }
    }
    return "defeat"; // Se nenhuma das condições anteriores for atendida
}
