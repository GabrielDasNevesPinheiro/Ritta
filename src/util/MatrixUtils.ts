type Matrix = number[][];

export function generateSparseArray(): Matrix {
    const matrix: Matrix = [];
    const possibleValues = [1, 2];
    const centerIndex = 1;

    for (let i = 0; i < 3; i++) {
        matrix[i] = [];
        for (let j = 0; j < 3; j++) {
            if (i === centerIndex && j === centerIndex) {
                let value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                let tries = 0;
                const maxTries = 10; // Limita o número de tentativas

                // Reduz a probabilidade de o valor central ser igual aos vizinhos
                while (
                    (matrix[i - 1][j] === value || matrix[i][j - 1] === value || matrix[i + 1]?.[j] === value || matrix[i]?.[j + 1] === value) &&
                    tries < maxTries
                ) {
                    value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
                    tries++;
                }

                if (tries === maxTries) {
                    // Se excedeu o número de tentativas, ignora a restrição
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
        1: 2,
        2: 3,
    };

    let multiplier = 0;

    let horizontal = (matrix[1][1] == matrix[1][0] && matrix[1][1] == matrix[1][2]);
    let vertical = (matrix[1][1] == matrix[0][1] && matrix[1][1] == matrix[2][1]);
    let diagonalLtR = (matrix[1][1] == matrix[0][0] && matrix[1][1] == matrix[2][2]);
    let diagonalRtL = (matrix[1][1] == matrix[0][2] && matrix[1][1] == matrix[2][0]);

    if(horizontal) multiplier += multipliers[matrix[1][1]];
    if(vertical) multiplier += multipliers[matrix[1][1]];
    if(diagonalLtR) multiplier += multipliers[matrix[1][1]];
    if(diagonalRtL) multiplier += multipliers[matrix[1][1]];

    return multiplier;
}


export function generateNeverMatchedArray(): Matrix {
    const patterns: Matrix[] = [
        [
            [2, 1, 2],
            [2, 1, 1],
            [1, 2, 2]
        ],
        [
            [1, 2, 2],
            [2, 2, 1],
            [1, 1, 2]
        ],
        [
            [1, 1, 2],
            [2, 2, 1],
            [1, 1, 2]
        ],
        [
            [1, 2, 2],
            [2, 2, 1],
            [1, 1, 2]
        ],
        [
            [1, 2, 2],
            [1, 2, 2],
            [1, 1, 2]
        ], [
            [1, 1, 1],
            [2, 2, 1],
            [1, 1, 1]
        ], [
            [2, 1, 2],
            [2, 2, 1],
            [2, 1, 1]
        ]

    ];

    const randomIndex = Math.floor(Math.random() * patterns.length);

    return patterns[randomIndex];
}