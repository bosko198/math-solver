from django.urls import path
from .views import (test_solver, equation_solver, differentiate, integrate_expr, step_solver, polynomial_solver, limit_solver, derivative_solver, differential_solver,)

urlpatterns = [
    path('test/', test_solver),
    path('solve', equation_solver),
    path('differentiate', differentiate),
    path('integrate', integrate_expr),
    path('step', step_solver),
    path("polynomial", polynomial_solver, name="polynomial_solver"),
    path('limit/', limit_solver, name="limit_solver"),
    path("derivative/", derivative_solver, name="derivative_solver"),
    path("differential/", differential_solver, name="differential_solver"),
]
