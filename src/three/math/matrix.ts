export function computeDot(mat_a: number[][], mat_b: number[][]) {
    const mat_a_col_size = mat_a.length;
    const mat_b_row_size = mat_b[0].length;

    const mat_out: number[][] = [];
    for (var i = 0; i < mat_a_col_size; i++) {
        mat_out[i] = [];
        for (var j = 0; j < mat_b_row_size; j++) {
            mat_out[i][j] = 0;
        }
    }

    for (var i = 0; i < mat_a_col_size; i++) {
        for (var j = 0; j < mat_b_row_size; j++) {
            for (var k = 0; k < mat_a_col_size; k++) {
                mat_out[i][j] += mat_a[i][k] * mat_b[k][j];
            }
        }
    }

    return mat_out;
};