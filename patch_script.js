const fs = require('fs');
let content = fs.readFileSync('src/components/CalculadoraTurnos.astro', 'utf-8');

const initLogic = `
        function inicializarCalculadora() {
            if (typeof turnosDb !== 'undefined' && turnosDb.length > 0) {
                if(document.getElementById('salario').value) {
                    calcularTurnoExacto();
                } else {
                    renderTurnoDetails(turnosDb[0]);
                    renderMatrix(turnosDb[0]);
                    renderizarTablaMatrix();
                }
            }
        }
        
        // Ejecutar init al cargar
        setTimeout(inicializarCalculadora, 100);
`;

if (!content.includes('inicializarCalculadora')) {
    content = content.replace(
        "document.getElementById('turnoSelect').addEventListener('change', calcularTurnoExacto);",
        "document.getElementById('turnoSelect').addEventListener('change', calcularTurnoExacto);\n" + initLogic
    );
    fs.writeFileSync('src/components/CalculadoraTurnos.astro', content);
    console.log("Patched!!");
} else {
    console.log("Already patched");
}
