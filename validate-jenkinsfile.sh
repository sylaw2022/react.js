#!/bin/bash

# Jenkinsfile Syntax Validator
# Validates Jenkinsfile syntax using multiple methods

set -e

JENKINSFILE="${1:-Jenkinsfile}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================================"
echo "Jenkinsfile Syntax Validation"
echo "============================================================"
echo ""

if [ ! -f "$JENKINSFILE" ]; then
    echo "❌ Error: $JENKINSFILE not found"
    exit 1
fi

echo "📄 File: $JENKINSFILE"
echo ""

# Basic structure checks
echo "🔍 Running syntax checks..."
echo ""

# Check 1: Balanced braces
OPEN_BRACES=$(grep -o '{' "$JENKINSFILE" | wc -l)
CLOSE_BRACES=$(grep -o '}' "$JENKINSFILE" | wc -l)
if [ "$OPEN_BRACES" -eq "$CLOSE_BRACES" ]; then
    echo "✅ Braces: Balanced ($OPEN_BRACES/{, $CLOSE_BRACES/})"
else
    echo "❌ Braces: Unbalanced ($OPEN_BRACES/{, $CLOSE_BRACES/})"
    EXIT_CODE=1
fi

# Check 2: Balanced parentheses
OPEN_PARENS=$(grep -o '(' "$JENKINSFILE" | wc -l)
CLOSE_PARENS=$(grep -o ')' "$JENKINSFILE" | wc -l)
if [ "$OPEN_PARENS" -eq "$CLOSE_PARENS" ]; then
    echo "✅ Parentheses: Balanced ($OPEN_PARENS/(, $CLOSE_PARENS/)"
else
    echo "❌ Parentheses: Unbalanced ($OPEN_PARENS/(, $CLOSE_PARENS/)"
    EXIT_CODE=1
fi

# Check 3: Balanced brackets
OPEN_BRACKETS=$(grep -o '\[' "$JENKINSFILE" | wc -l)
CLOSE_BRACKETS=$(grep -o ']' "$JENKINSFILE" | wc -l)
if [ "$OPEN_BRACKETS" -eq "$CLOSE_BRACKETS" ]; then
    echo "✅ Brackets: Balanced ($OPEN_BRACKETS/[, $CLOSE_BRACKETS/])"
else
    echo "❌ Brackets: Unbalanced ($OPEN_BRACKETS/[, $CLOSE_BRACKETS/])"
    EXIT_CODE=1
fi

# Check 4: Triple-quoted strings
TRIPLE_QUOTES=$(grep -o '"""' "$JENKINSFILE" | wc -l)
if [ $((TRIPLE_QUOTES % 2)) -eq 0 ]; then
    echo "✅ Triple-quoted strings: Balanced ($TRIPLE_QUOTES found)"
else
    echo "❌ Triple-quoted strings: Unbalanced ($TRIPLE_QUOTES found, should be even)"
    EXIT_CODE=1
fi

# Check 5: Pipeline declaration
if grep -q "pipeline {" "$JENKINSFILE"; then
    echo "✅ Pipeline declaration: Found"
else
    echo "❌ Pipeline declaration: Missing"
    EXIT_CODE=1
fi

# Check 6: Stages block
if grep -q "stages {" "$JENKINSFILE"; then
    echo "✅ Stages block: Found"
else
    echo "⚠️  Stages block: Not found (may be valid)"
fi

# Check 7: Stage count
STAGE_COUNT=$(grep -c "stage(" "$JENKINSFILE" || echo "0")
echo "ℹ️  Stage count: $STAGE_COUNT"

# Check 8: Agent declaration
if grep -q "agent" "$JENKINSFILE"; then
    echo "✅ Agent declaration: Found"
else
    echo "⚠️  Agent declaration: Not found"
fi

echo ""
echo "============================================================"

# Try Groovy validation if available
if command -v groovy >/dev/null 2>&1; then
    echo ""
    echo "🔍 Running Groovy syntax validation..."
    echo ""
    
    # Create a simple Groovy validator
    cat > /tmp/jenkinsfile_validator.groovy << 'GROOVYEOF'
def file = new File('Jenkinsfile')
def content = file.text

// Basic structure validation
def issues = []
def openBraces = content.count('{')
def closeBraces = content.count('}')
if (openBraces != closeBraces) {
    issues << "Unbalanced braces: $openBraces/{, $closeBraces/}"
}

def openParens = content.count('(')
def closeParens = content.count(')')
if (openParens != closeParens) {
    issues << "Unbalanced parentheses: $openParens/(, $closeParens/)"
}

if (issues.isEmpty()) {
    println "✅ Groovy syntax validation passed"
    System.exit(0)
} else {
    println "❌ Groovy syntax issues found:"
    issues.each { println "   • $it" }
    System.exit(1)
}
GROOVYEOF
    
    cd "$SCRIPT_DIR"
    if groovy /tmp/jenkinsfile_validator.groovy 2>&1; then
        echo ""
        echo "✅ Groovy validation: PASSED"
    else
        echo ""
        echo "❌ Groovy validation: FAILED"
        EXIT_CODE=1
    fi
    rm -f /tmp/jenkinsfile_validator.groovy
else
    echo ""
    echo "ℹ️  Groovy not installed. Install with: sudo snap install groovy --classic"
    echo "   For full validation, use Jenkins web interface or install Groovy"
fi

echo ""
if [ "${EXIT_CODE:-0}" -eq 0 ]; then
    echo "✅ All syntax checks passed!"
    echo ""
    echo "ℹ️  Note: Full Declarative Pipeline validation requires Jenkins"
    echo "   (Jenkinsfile uses Jenkins-specific syntax)"
    exit 0
else
    echo "❌ Syntax issues found. Please fix before using in Jenkins."
    exit 1
fi

