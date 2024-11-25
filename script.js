function updateDimensionInputs() {
    // Shape selection triggers dynamic input fields.
    const shape = document.getElementById('shape').value;
    const shapeInputs = document.getElementById('shapeInputs');
    
    shapeInputs.innerHTML = ''; // Clear old inputs.
    shapeInputs.classList.add('hidden'); // Hide inputs by default.
    
    // Dynamically change the inputs based on selected shape
    const inputTemplates = {
        cube: '<p>Enter the side length of the cube:</p><input type="number" id="dimensions" name="dimensions" placeholder="e.g., 5">',
        sphere: '<p>Enter the radius of the sphere:</p><input type="number" id="dimensions" name="dimensions" placeholder="e.g., 5">',
        cylinder: '<p>Enter the radius and height of the cylinder (comma separated):</p><input type="text" id="dimensions" name="dimensions" placeholder="e.g., 5,10">',
        cone: '<p>Enter the radius and height of the cone (comma separated):</p><input type="text" id="dimensions" name="dimensions" placeholder="e.g., 5,10">',
        prism: `<p>Enter the base area and height of the prism (comma separated):</p>
                <input type="text" id="dimensions" name="dimensions" placeholder="e.g., 30,10">
                <p>Enter the side lengths of the base (comma separated):</p>
                <input type="text" id="sideLengths" name="sideLengths" placeholder="e.g., 5,10,5,10">`,
        pyramid: `<p>Enter the base area and height of the pyramid (comma separated):</p>
                  <input type="text" id="dimensions" name="dimensions" placeholder="e.g., 30,10">
                  <p>Enter the side lengths of the base (comma separated):</p>
                  <input type="text" id="sideLengths" name="sideLengths" placeholder="e.g., 5,10,5,10">`
    };

    // Show the inputs for the selected shape
    if (inputTemplates[shape]) {
        shapeInputs.innerHTML = inputTemplates[shape];
        shapeInputs.classList.remove('hidden'); // Unhide the inputs now
    }
}

function calculateVolumeSurface() {
    // First get the inputs
    const shape = document.getElementById('shape').value;
    const dimensionsInput = document.getElementById('dimensions');
    const sideLengthsInput = document.getElementById('sideLengths');
    const resultDiv = document.getElementById('volumeResult');
    const formulaDiv = document.getElementById('volumeFormula');
    
    resultDiv.innerHTML = ''; // Clear old results
    formulaDiv.innerHTML = ''; // Clear old formulas

    // Some validation before doing calculations
    if (!shape) {
        resultDiv.innerText = 'Please select a shape.'; // Error if no shape selected
        return;
    }

    // Ensure dimensions are provided
    if (!dimensionsInput || !dimensionsInput.value) {
        resultDiv.innerText = 'Please provide dimensions for the selected shape.';
        return;
    }

    const dimensions = dimensionsInput.value.split(',').map(Number);
    if (dimensions.some(isNaN)) {
        resultDiv.innerText = 'Please enter valid numeric dimensions.';
        return;
    }

    let sideLengths = []; // Used for prism and pyramid side lengths
    if (sideLengthsInput && sideLengthsInput.value) {
        sideLengths = sideLengthsInput.value.split(',').map(Number);
        if (sideLengths.some(isNaN)) {
            resultDiv.innerText = 'Please enter valid numeric side lengths.';
            return;
        }
    }

    // Initialize vars for results
    let volume = 0, surfaceArea = 0, resultText = '', formulaText = '';

    // Switch case based on selected shape
    switch (shape) {
        case 'prism':
            const [baseArea, heightPrism] = dimensions;
            volume = baseArea * heightPrism;
            surfaceArea = 2 * baseArea + sideLengths.reduce((sum, length) => sum + length, 0) * heightPrism;
            formulaText = `Volume = Base Area × Height = ${baseArea} × ${heightPrism}`;
            break;
        case 'pyramid':
            const [baseAreaPyramid, heightPyramid] = dimensions;
            volume = (1 / 3) * baseAreaPyramid * heightPyramid;
            const slantHeights = sideLengths.map(length => Math.sqrt(Math.pow(length / 2, 2) + Math.pow(heightPyramid, 2)));
            surfaceArea = baseAreaPyramid + slantHeights.reduce((sum, slant) => sum + slant, 0);
            formulaText = `Volume = (1/3) × Base Area × Height = (1/3) × ${baseAreaPyramid} × ${heightPyramid}`;
            break;
        case 'cube':
            const [sideCube] = dimensions;
            volume = Math.pow(sideCube, 3);
            surfaceArea = 6 * Math.pow(sideCube, 2);
            formulaText = `Volume = Side³ = ${sideCube}³`;
            break;
        case 'sphere':
            const [radius] = dimensions;
            volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
            surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
            formulaText = `Volume = (4/3)πr³ = (4/3)π(${radius})³`;
            break;
        case 'cone':
            const [radiusCone, heightCone] = dimensions;
            volume = (1 / 3) * Math.PI * Math.pow(radiusCone, 2) * heightCone;
            surfaceArea = Math.PI * radiusCone * (radiusCone + Math.sqrt(Math.pow(heightCone, 2) + Math.pow(radiusCone, 2)));
            formulaText = `Volume = (1/3)πr²h = (1/3)π(${radiusCone})²(${heightCone})`;
            break;
        case 'cylinder':
            const [radiusCylinder, heightCylinder] = dimensions;
            volume = Math.PI * Math.pow(radiusCylinder, 2) * heightCylinder;
            surfaceArea = 2 * Math.PI * radiusCylinder * (radiusCylinder + heightCylinder);
            formulaText = `Volume = πr²h = π(${radiusCylinder})²(${heightCylinder})`;
            break;
    }

    // Show results
    resultText = `Volume: ${volume.toFixed(2)} cubic units<br>Surface Area: ${surfaceArea.toFixed(2)} square units`;
    resultDiv.innerHTML = resultText;
    formulaDiv.innerHTML = formulaText;
}

function calculateHypotenuse() {
    // For the Pythagorean theorem
    const sideA = document.getElementById('sideA').value.split(',').map(Number);
    const sideB = document.getElementById('sideB').value.split(',').map(Number);
    const resultDiv = document.getElementById('pythagResult');
    const formulaDiv = document.getElementById('pythagFormula');
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');

    if (sideA.some(isNaN) || sideB.some(isNaN)) {
        resultDiv.innerText = 'Please enter valid numeric values for sides A and B.';
        return;
    }

    const hypotenuse = Math.sqrt(Math.pow(sideA[0], 2) + Math.pow(sideB[0], 2));
    resultDiv.innerHTML = `Hypotenuse: ${hypotenuse.toFixed(2)} units`;
    formulaDiv.innerHTML = `Formula: c = √(a² + b²)<br>c = √(${sideA[0]}² + ${sideB[0]}²)`;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the previous drawing

    // Draw the right triangle
    ctx.beginPath();
    ctx.moveTo(50, 50);  // Right-angle corner
    ctx.lineTo(50 + sideA[0] * 20, 50);  // Horizontal line (base)
    ctx.lineTo(50, 50 + sideB[0] * 20);  // Vertical line (height)
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Add labels to the sides
    ctx.font = '12px Arial';
    ctx.fillText(`a = ${sideA[0]}`, 50 + sideA[0] * 10, 40);  // Base label
    ctx.fillText(`b = ${sideB[0]}`, 40, 50 + sideB[0] * 10);  // Height label
    ctx.fillText(`c = ${hypotenuse.toFixed(2)}`, 50 + sideA[0] * 10, 50 + sideB[0] * 10);  // Hypotenuse label
}
