import math
from decimal import Decimal, getcontext

getcontext().prec = 6


def setup_model_params():
    sigma = Decimal('0.1')
    v = Decimal('1.1')
    h = Decimal('1')
    k1, k2, k3 = [Decimal('0.26'), Decimal('0.09'), Decimal('0.01')]
    return [sigma, v, h, k1, k2, k3]


def calculate_data(steps, k1, k2, k3, D, h):
    data = []
    for i in range(1, steps + 1):
        hs = (h * Decimal(str(i))) ** Decimal('0.5')
        g1 = -k1
        g2 = -k2 * (Decimal('1') - Decimal(str(math.exp(-k1 * hs))))
        g3 = -k3 * (Decimal('1') - Decimal(str(math.exp(-k2 * hs * (1 - Decimal(str(math.exp(-k1 * hs))))))))
        data.append([hs, g1 / D, g2 / D, g3 / D])

    return data


def calculate_kvgs(steps, data, h, V_star):
    kvgs = []

    for i in range(1, steps + 1):
        a, b, c, d = data[i - 1]
        if i != 1:
            kvg1 = Decimal('2') * data[i - 2][0] + data[i - 2][0] * (a + data[i - 2][0]) * V_star - a * data[i - 2][
                0] * (a + data[i - 2][0]) * b
            kvg2 = Decimal('2') * data[i - 2][0] + data[i - 2][0] * (a + data[i - 2][0]) * V_star - a * data[i - 2][
                0] * (a + data[i - 2][0]) * c
            kvg3 = Decimal('2') * data[i - 2][0] + data[i - 2][0] * (a + data[i - 2][0]) * V_star - a * data[i - 2][
                0] * (a + data[i - 2][0]) * d
        else:
            kvg1 = Decimal('2') * h + h * (a + h) * V_star - a * h * (a + h) * b
            kvg2 = Decimal('2') * h + h * (a + h) * V_star - a * h * (a + h) * c
            kvg3 = Decimal('2') * h + h * (a + h) * V_star - a * h * (a + h) * d

        kvgs.append([a, kvg1, kvg2, kvg3])

    return kvgs


def calculate_k1s(steps, kvgs, data, V_star):
    k1s = []

    for i in range(2, steps + 2):
        a, b, c, d = kvgs[i - 2]

        k11 = (Decimal('2') * data[i - 2][0] + data[i - 2][0] * (data[i - 2][0] + a) * V_star + 2 * a) / b
        k12 = (Decimal('2') * data[i - 2][0] + data[i - 2][0] * (data[i - 2][0] + a) * V_star + 2 * a) / c
        k13 = (Decimal('2') * data[i - 2][0] + data[i - 2][0] * (data[i - 2][0] + a) * V_star + 2 * a) / d
        k1s.append([a, k11, k12, k13])

    return k1s


def calculate_k2s(steps, kvgs):
    k2s = []
    for i in range(steps):
        a, b, c, d = kvgs[i]

        k21 = (Decimal('2') * a) / b
        k22 = (Decimal('2') * a) / c
        k23 = (Decimal('2') * a) / d

        k2s.append([a, k21, k22, k23])

    return k2s


def calculate_result(steps, x0, critical_value, h, k1s, k2s):
    result = [x0]
    tep = result[0]
    for i in range(1, steps + 1):
        b, ls = k1s[i - 1], k2s[i - 1]
        Dx = b[1] - ls[1]*(Decimal('1')-h)
        if i == 1:
            tep = x0 * Dx
            result.append(tep)
        else:
            tep = k2s[i - 2][1] * tep - result[i - 1] * k1s[i - 2][1]
            result.append(tep)

        if abs(tep) <= critical_value:
            break
    return result


def river_model_algorithm_solution(steps, init_arg, critical_value):
    """
        Function that represents the solution of water grading quality problem \n
        :param critical_value: critical concentration of given chemical reagent in water
        :param steps - count of steps, that will be predicted \n
        :param init_arg - initial concentration value of some chemical reagent in water \n
        :return list with length 'steps' and contains predicted values of concentration
    """
    sigma, v, h, k1, k2, k3 = setup_model_params()
    niu = v ** Decimal('2')
    x0 = Decimal(str(init_arg))

    V = Decimal('1') - (niu / v)
    D = sigma / (v ** Decimal('2'))
    V_star = V / D

    data = calculate_data(steps, k1, k2, k3, D, h)
    kvgs = calculate_kvgs(steps, data, h, V_star)
    k1s = calculate_k1s(steps, kvgs, data, V_star)
    k2s = calculate_k2s(steps, kvgs)
    return calculate_result(steps, x0, critical_value, h, k1s, k2s)


def solve(data, critical_value, steps=50):
    return river_model_algorithm_solution(steps, data, critical_value)
