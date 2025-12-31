
window.MathGenerator = {
    generate(count = 5) {
        const questions = [];
        const types = ['wordProblem', 'advancedArithmetic', 'decimals', 'geometryComplex', 'algebraTwoStep'];

        for (let i = 0; i < count; i++) {
            // Cycle through types or pick random
            const type = types[i % types.length];
            questions.push(this.createQuestion(type, i));
        }
        return questions;
    },

    createQuestion(type, index) {
        switch (type) {
            case 'wordProblem': return this.genWordProblem(index);
            case 'advancedArithmetic': return this.genAdvancedArithmetic(index);
            case 'decimals': return this.genDecimals(index);
            case 'geometryComplex': return this.genGeometryComplex(index);
            case 'algebraTwoStep': return this.genAlgebraTwoStep(index);
            default: return this.genAdvancedArithmetic(index);
        }
    },

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randDecimal(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    },

    // 1. Multi-step Word Problem (Money)
    genWordProblem(index) {
        const names = ["Sofia", "Mateo", "Liam", "Ava", "Noah"];
        const name = names[this.rand(0, names.length - 1)];
        const startMoney = this.rand(50, 100); // $50 - $100
        const itemCost = this.rand(5, 12);
        const itemCount = this.rand(3, 5);

        const totalCost = itemCost * itemCount;
        const change = startMoney - totalCost;

        return {
            id: `hard_math_${index}`,
            question: `${name} has $${startMoney}. They want to buy ${itemCount} books that cost $${itemCost} each. How much money will ${name} have left?`,
            options: this.shuffle([
                `$${change}`,
                `$${change + 10}`,
                `$${startMoney - itemCost}`, // Subtracted only one
                `$${totalCost}` // Cost, not change
            ]),
            correct: `$${change}`,
            explanation: `First, find total cost: ${itemCount} × $${itemCost} = $${totalCost}. Then subtract from start: $${startMoney} - $${totalCost} = $${change}.`
        };
    },

    // 2. Order of Operations (PEMDAS)
    genAdvancedArithmetic(index) {
        // Form: (a + b) x c - d
        const a = this.rand(3, 12);
        const b = this.rand(2, 8);
        const c = this.rand(2, 5);
        const d = this.rand(5, 20);

        const ans = ((a + b) * c) - d;

        // Distractors
        const w1 = (a + b) * (c - d); // Wrong order
        const w2 = a + (b * c) - d;   // Forgot parens
        const w3 = ans + 5;

        return {
            id: `hard_math_${index}`,
            question: `Simplify the expression: (${a} + ${b}) × ${c} - ${d}`,
            options: this.shuffle([String(ans), String(w2), String(w3), String(ans - 2)]),
            correct: String(ans),
            explanation: `PEMDAS: Parentheses first (${a}+${b}=${a + b}). Multiply next (${a + b}×${c}=${(a + b) * c}). Finally subtract ${d}. Result is ${ans}.`
        };
    },

    // 3. Decimal Operations (+ or -)
    genDecimals(index) {
        const isAdd = Math.random() > 0.5;
        const n1 = parseFloat(this.randDecimal(10, 50));
        const n2 = parseFloat(this.randDecimal(1, 9));

        let ans, qStr, op;
        if (isAdd) {
            ans = (n1 + n2).toFixed(2);
            qStr = `${n1} + ${n2}`;
            op = "adding";
        } else {
            ans = (n1 - n2).toFixed(2);
            qStr = `${n1} - ${n2}`;
            op = "subtracting";
        }

        return {
            id: `hard_math_${index}`,
            question: `Solve: ${qStr}`,
            options: this.shuffle([
                ans,
                (parseFloat(ans) + 0.1).toFixed(2),
                (parseFloat(ans) - 1.0).toFixed(2),
                isAdd ? (n1 - n2).toFixed(2) : (n1 + n2).toFixed(2) // Wrong op
            ]),
            correct: ans,
            explanation: `Align the decimal points when ${op}. ${qStr} = ${ans}.`
        };
    },

    // 4. Geometry (Area of composite or large numbers)
    genGeometryComplex(index) {
        // Area of a rectangle
        const l = this.rand(12, 25);
        const w = this.rand(10, 20);
        const ans = l * w;

        return {
            id: `hard_math_${index}`,
            question: `A rectangular playground is ${l} feet long and ${w} feet wide. What is its area in square feet?`,
            options: this.shuffle([
                `${ans}`,
                `${(l + w) * 2}`, // Perimeter
                `${ans + 10}`,
                `${l * l}`
            ]),
            correct: `${ans}`,
            explanation: `Area = Length × Width. ${l} × ${w} = ${ans} sq ft.`
        };
    },

    // 5. Two-Step Algebra
    genAlgebraTwoStep(index) {
        // Form: ax + b = c
        const x = this.rand(2, 12);
        const a = this.rand(2, 5);
        const b = this.rand(1, 20);
        const c = (a * x) + b;

        return {
            id: `hard_math_${index}`,
            question: `Solve for x: ${a}x + ${b} = ${c}`,
            options: this.shuffle([String(x), String(x + 2), String(Math.floor(c / a)), "0"]),
            correct: String(x),
            explanation: `First subtract ${b} from both sides: ${a}x = ${c - b}. Then divide by ${a} to get x = ${x}.`
        };
    },

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
};
