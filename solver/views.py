from rest_framework.response import Response
from rest_framework.decorators import api_view
import sympy
from sympy import sympify, solve, symbols, diff, integrate, simplify, latex, Eq, Function
from sympy.solvers import solve
from sympy.solvers.solveset import linsolve

@api_view(['GET'])
def test_solver(request):
    return Response({"message": "Math solver backend is working"})

@api_view(['POST'])
def equation_solver(request):
    """
    Accepts a math expression like 'x**2-4'
    and solves for x.
    """
    try:
        expr = request.data.get("expression")
        x = symbols('x')
        solution = solve(sympify(expr), x)
        return Response({"expression": expr, "solution": [str(s) for s in solution]})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from sympy import sympify, symbols, diff, latex

@api_view(['POST'])
def differentiate(request):
    """
    Accepts a math expression and variable, returns the derivative.
    Example request:
    {
        "expression": "x**2 * exp(x)",
        "variable": "x"
    }
    """
    try:
        expr = request.data.get("expression")
        var = request.data.get("variable", "x")  # default to x if not provided

        # Parse the variable and expression
        symbol = symbols(var)
        parsed_expr = sympify(expr)

        # Compute derivative
        derivative = diff(parsed_expr, symbol)

        return Response({
            "expression": expr,
            "variable": var,
            "derivative": str(derivative),
            "latex": latex(derivative)  # nice LaTeX output for frontend rendering
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def integrate_expr(request):
    try:
        expr = request.data.get("expression")
        integral_type = request.data.get("type", "single")  # single, double, triple, contour, surface, volume
        variables = request.data.get("variables", ["x"])    # list of variable names
        bounds = request.data.get("bounds", [])             # list of [lower, upper] pairs

        parsed_expr = sympify(expr)
        syms = [symbols(v) for v in variables]

        result = None

        # Single integral
        if integral_type == "single":
            if bounds and bounds[0][0] and bounds[0][1]:
                result = integrate(parsed_expr, (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])))
            else:
                result = integrate(parsed_expr, syms[0])

        # Double integral
        elif integral_type == "double":
            if bounds and all(b[0] and b[1] for b in bounds):
                result = integrate(parsed_expr,
                                   (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])),
                                   (syms[1], sympify(bounds[1][0]), sympify(bounds[1][1])))
            else:
                result = integrate(integrate(parsed_expr, syms[0]), syms[1])

        # Triple integral
        elif integral_type == "triple":
            if bounds and all(b[0] and b[1] for b in bounds):
                result = integrate(parsed_expr,
                                   (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])),
                                   (syms[1], sympify(bounds[1][0]), sympify(bounds[1][1])),
                                   (syms[2], sympify(bounds[2][0]), sympify(bounds[2][1])))
            else:
                result = integrate(integrate(integrate(parsed_expr, syms[0]), syms[1]), syms[2])

        # Contour integral (simplified as line integral for now)
        elif integral_type == "contour":
            if len(syms) != 1:
                return Response({"error": "Contour integral requires exactly 1 variable"}, status=400)
            if bounds and bounds[0][0] and bounds[0][1]:
                result = integrate(parsed_expr, (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])))
            else:
                result = integrate(parsed_expr, syms[0])

        # Surface integral (treated as double integral over x,y)
        elif integral_type == "surface":
            if len(syms) < 2:
                return Response({"error": "Surface integral requires at least 2 variables"}, status=400)
            if bounds and len(bounds) == 2 and all(b[0] and b[1] for b in bounds):
                result = integrate(parsed_expr,
                                   (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])),
                                   (syms[1], sympify(bounds[1][0]), sympify(bounds[1][1])))
            else:
                result = integrate(integrate(parsed_expr, syms[0]), syms[1])

        # Volume integral (triple)
        elif integral_type == "volume":
            if len(syms) != 3:
                return Response({"error": "Volume integral requires 3 variables (x,y,z)"}, status=400)
            if bounds and len(bounds) == 3 and all(b[0] and b[1] for b in bounds):
                result = integrate(parsed_expr,
                                   (syms[0], sympify(bounds[0][0]), sympify(bounds[0][1])),
                                   (syms[1], sympify(bounds[1][0]), sympify(bounds[1][1])),
                                   (syms[2], sympify(bounds[2][0]), sympify(bounds[2][1])))
            else:
                result = integrate(integrate(integrate(parsed_expr, syms[0]), syms[1]), syms[2])

        else:
            return Response({"error": "Unknown integral type"}, status=400)

        return Response({
            "expression": expr,
            "integral": latex(result)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
def step_solver(request):
    """
    Returns both the solution and a step-by-step explanation.
    Example: {"expression": "x**2 - 4"}
    """
    try:
        expr = request.data.get("expression")
        x = symbols('x')
        parsed_expr = sympify(expr)

        # Solve the equation
        solutions = solve(parsed_expr, x)

        # Build a simple step-by-step explanation
        steps = []
        steps.append(f"Step 1: Parse the expression → {parsed_expr}")
        steps.append("Step 2: Set equation equal to 0")
        steps.append(f"Step 3: Solve for x → {solutions}")

        return Response({
            "expression": expr,
            "solution": [str(s) for s in solutions],
            "steps": steps
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def polynomial_solver(request):
    try:
        expr = request.data.get("expression")
        operation = request.data.get("operation", "factor")
        parsed_expr = sympify(expr)
        x = symbols('x')

        if operation == "factor":
            result = sympy.factor(parsed_expr)
        elif operation == "expand":
            result = sympy.expand(parsed_expr)
        elif operation == "roots":
            result = sympy.solve(sympy.Eq(parsed_expr, 0), x)
        elif operation == "differentiate":
            result = sympy.diff(parsed_expr, x)
        elif operation == "integrate":
            result = sympy.integrate(parsed_expr, x)
        else:
            return Response({"error": "Unknown operation"}, status=400)

        return Response({"expression": expr, "result": latex(result)})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def limit_solver(request):
    try:
        expr = request.data.get("expression")
        var = request.data.get("variable", "x")
        approach = request.data.get("approach", 0)
        direction = request.data.get("direction", "")  # "", "+", or "-"

        symbol = symbols(var)
        parsed_expr = sympify(expr)

        result = sympy.limit(parsed_expr, symbol, sympify(approach), dir=direction or None)

        return Response({"expression": expr, "limit": latex(result)})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def derivative_solver(request):
    try:
        expr = request.data.get("expression")
        variables = request.data.get("variables", ["x"])
        orders = request.data.get("orders", [1])
        mode = request.data.get("mode", "partial")

        parsed_expr = sympify(expr)

        if mode == "partial":
            # Sequential differentiation with respect to variables and orders
            result = parsed_expr
            for var, order in zip(variables, orders):
                symbol = symbols(var)
                result = sympy.diff(result, symbol, int(order))
            return Response({"expression": expr, "derivative": latex(result)})

        elif mode == "gradient":
            # Gradient vector: list of partial derivatives
            syms = [symbols(v) for v in variables]
            grads = [sympy.diff(parsed_expr, s) for s in syms]
            result = [latex(g) for g in grads]
            return Response({"expression": expr, "derivative": result})

        elif mode == "hessian":
            # Hessian matrix: nested list of LaTeX strings
            syms = [symbols(v) for v in variables]
            hessian_matrix = sympy.hessian(parsed_expr, syms)
            result = [[latex(entry) for entry in row] for row in hessian_matrix.tolist()]
            return Response({"expression": expr, "derivative": result})

        else:
            return Response({"error": "Unknown mode"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


def preprocess_equation(eqn: str, funcs, var_name: str):
    """
    Convert user-friendly notation (y'(x), y''(x), y'(0), dy/dx) into SymPy syntax.
    """
    if not eqn or not eqn.strip():
        return ""

    # Handle primes at x
    eqn = eqn.replace(f"y'''(0)", f"Derivative(y({var_name}), ({var_name},3)).subs({var_name},0)")
    eqn = eqn.replace(f"y''(0)", f"Derivative(y({var_name}), ({var_name},2)).subs({var_name},0)")
    eqn = eqn.replace(f"y'(0)", f"Derivative(y({var_name}), {var_name}).subs({var_name},0)")

    # Handle primes at x
    eqn = eqn.replace(f"y'''({var_name})", f"Derivative(y({var_name}), ({var_name},3))")
    eqn = eqn.replace(f"y''({var_name})", f"Derivative(y({var_name}), ({var_name},2))")
    eqn = eqn.replace(f"y'({var_name})", f"Derivative(y({var_name}), {var_name})")

    # Handle dy/dx
    eqn = eqn.replace("dy/dx", f"Derivative(y({var_name}), {var_name})")

    return eqn

@api_view(['POST'])
def differential_solver(request):
    """
    Differential Equations Solver:
    - Accepts single ODEs or systems
    - Supports initial conditions
    - Converts natural input to SymPy syntax
    - Skips empty inputs gracefully
    """
    try:
        # Accept either "equation" (string) or "equations" (list)
        eqns = request.data.get("equations")
        if eqns is None:
            eqn = request.data.get("equation")
            if eqn is None:
                return Response({"error": "No equation(s) provided"}, status=400)
            eqns = [eqn]
        elif isinstance(eqns, str):
            eqns = [eqns]  # normalize string to list

        funcs = request.data.get("functions", ["y"])
        var_name = request.data.get("variable", "x")
        conditions = request.data.get("conditions", [])

        x = symbols(var_name)
        locals_dict = {var_name: x, "Derivative": sympy.Derivative}
        for f in funcs:
            locals_dict[f] = Function(f)

        # Preprocess and parse equations
        parsed_eqns = []
        for eqn in eqns:
            if not eqn.strip():
                continue  # skip empty equations
            eqn_clean = preprocess_equation(eqn, funcs, var_name)

            # Wrap with Eq(...) if user typed "="
            if "=" in eqn_clean and "==" not in eqn_clean:
                lhs, rhs = eqn_clean.split("=", 1)  # ✅ only split once
                eqn_clean = f"Eq({lhs.strip()}, {rhs.strip()})"

            parsed = sympify(eqn_clean, locals=locals_dict)
            if not isinstance(parsed, sympy.Equality):
                parsed = Eq(parsed, 0)
            parsed_eqns.append(parsed)

        if not parsed_eqns:
            return Response({"error": "No valid equations provided"}, status=400)

        # Parse initial conditions
        ics = {}
        for cond in conditions:
            if not cond.strip():
                continue
            cond_clean = preprocess_equation(cond, funcs, var_name)
            if "=" in cond_clean and "==" not in cond_clean:
                lhs, rhs = cond_clean.split("=", 1)  # ✅ only split once
                cond_clean = f"Eq({lhs.strip()}, {rhs.strip()})"
            cond_parsed = sympify(cond_clean, locals=locals_dict)
            if isinstance(cond_parsed, sympy.Equality):
                ics[cond_parsed.lhs] = cond_parsed.rhs

        # Solve
        if ics:
            solution = sympy.dsolve(parsed_eqns, ics=ics)
        else:
            solution = sympy.dsolve(parsed_eqns)

        # Format solution(s)
        if isinstance(solution, list):
            result = [latex(sol) for sol in solution]
        else:
            result = latex(solution)

        return Response({"equations": eqns, "solution": result})

    except Exception as e:
        return Response({"error": str(e)}, status=400)