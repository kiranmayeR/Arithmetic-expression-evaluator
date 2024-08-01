document.getElementById('expression-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const expression = document.getElementById('expression').value;
    try {
        const result = evaluateExpression(expression);
        document.getElementById('result').textContent = `Result: ${result}`;
        
        // Display tokens
        const tokens = tokenize(expression);
        displayTokens(tokens);

        const treeData = buildExpressionTree(expression);
        drawTree(treeData);
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
        document.getElementById('tree-container').innerHTML = '';
        document.getElementById('tokens').innerHTML = '';
    }
});

function evaluateExpression(expression) {
    validateExpression(expression);
    const tokens = tokenize(expression);
    return compute(tokens);
}

function validateExpression(expression) {
    if (!/^[0-9+\-*/%^().\s]+$/.test(expression)) {
        throw new Error('Invalid characters in expression');
    }

    let balance = 0;
    for (const char of expression) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) throw new Error('Unbalanced parentheses');
    }

    if (balance !== 0) throw new Error('Unbalanced parentheses');
}

function tokenize(expression) {
    return expression.match(/\d+\.?\d*|[+\-*/%^()]/g) || [];
}

function displayTokens(tokens) {
    const tokensContainer = document.getElementById('tokens');
    tokensContainer.innerHTML = '<h3>Tokens:</h3>';
    tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.className = 'token';
        tokenElement.textContent = token;
        tokensContainer.appendChild(tokenElement);
    });
}

function precedence(op) {
    switch (op) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
        case '%':
            return 2;
        case '^':
            return 3;
        default:
            return 0;
    }
}

function applyOperator(operators, values) {
    const operator = operators.pop();
    const right = values.pop();
    const left = values.pop();
    switch (operator) {
        case '+':
            values.push(left + right);
            break;
        case '-':
            values.push(left - right);
            break;
        case '*':
            values.push(left * right);
            break;
        case '/':
            values.push(left / right);
            break;
        case '%':
            values.push(left % right);
            break;
        case '^':
            values.push(Math.pow(left, right));
            break;
    }
}

function compute(tokens) {
    const values = [];
    const operators = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (!isNaN(token)) {
            values.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators[operators.length - 1] !== '(') {
                applyOperator(operators, values);
            }
            operators.pop();
        } else {
            while (operators.length && precedence(operators[operators.length - 1]) >= precedence(token)) {
                applyOperator(operators, values);
            }
            operators.push(token);
        }
    }

    while (operators.length) {
        applyOperator(operators, values);
    }

    return values.pop();
}

function buildExpressionTree(expression) {
    const tokens = tokenize(expression);
    const stack = [];
    const precedenceStack = [];

    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push({ value: token });
        } else if (token === '(') {
            precedenceStack.push(token);
        } else if (token === ')') {
            while (precedenceStack.length && precedenceStack[precedenceStack.length - 1] !== '(') {
                const operator = precedenceStack.pop();
                const right = stack.pop();
                const left = stack.pop();
                stack.push({ value: operator, children: [left, right] });
            }
            precedenceStack.pop(); // Remove '('
        } else {
            while (precedenceStack.length && precedence(precedenceStack[precedenceStack.length - 1]) >= precedence(token)) {
                const operator = precedenceStack.pop();
                const right = stack.pop();
                const left = stack.pop();
                stack.push({ value: operator, children: [left, right] });
            }
            precedenceStack.push(token);
        }
    });

    while (precedenceStack.length) {
        const operator = precedenceStack.pop();
        const right = stack.pop();
        const left = stack.pop();
        stack.push({ value: operator, children: [left, right] });
    }

    return stack.pop();
}

function drawTree(treeData) {
    const treeContainer = document.getElementById('tree-container');
    treeContainer.innerHTML = '';

    const width = treeContainer.clientWidth;
    const height = 400;

    const svg = d3.select(treeContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const root = d3.hierarchy(treeData);

    const treeLayout = d3.tree().size([width, height - 100]);
    treeLayout(root);

    svg.selectAll('lines')
        .data(root.links())
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y + 50)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y + 50)
        .attr('stroke', 'black');

    svg.selectAll('nodes')
        .data(root.descendants())
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y + 50)
        .attr('r', 20)
        .attr('fill', '#6c5ce7');

    svg.selectAll('text')
        .data(root.descendants())
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 55)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.value);
}
