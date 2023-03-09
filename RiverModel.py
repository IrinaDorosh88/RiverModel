import random
import math

from decimal import Decimal, getcontext


def river_model_algorithm_solution(steps, init_arg):
  getcontext().prec = 28
  sigma = Decimal('0.1')
  v = Decimal('1.1')
  h = Decimal('1')
  niu = v**Decimal('2')
  x0 = Decimal(str(init_arg))
  
  V = Decimal('1') - (niu / v)
  D = sigma / (v**Decimal('2'))

  V_star = V / D

  k1, k2, k3 = [Decimal('0.26'), Decimal('0.09'), Decimal('0.01')]
  data = []
  for i in range(1, steps+1):
    hs = (h*Decimal(str(i)))**Decimal('0.5')
    g1 = -k1
    g2 = -k2 * (Decimal('1') - Decimal(str(math.exp(-k1*hs))))
    g3 = -k3 * (Decimal('1') - Decimal(str(math.exp(-k2*hs*(1- Decimal(str(math.exp(-k1*hs))))))))
    data.append([hs, g1/D,g2/D,g3/D])
  kvgs = []

  for i in range(1, steps + 1):
    a,b,c,d = data[i-1]
    if i != 1:
      kvg1 = Decimal('2')*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*b
      kvg2 = Decimal('2')*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*c
      kvg3 = Decimal('2')*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*d
    else:
      kvg1 = Decimal('2')*h + h*(a + h)*V_star - a*h*(a + h)*b
      kvg2 = Decimal('2')*h + h*(a + h)*V_star - a*h*(a + h)*c
      kvg3 = Decimal('2')*h + h*(a + h)*V_star - a*h*(a + h)*d
      

    kvgs.append([a, kvg1, kvg2, kvg3])

  k1s = []

  for i in range(1, steps+1):
    a,b,c,d = kvgs[i-1]
    k11 = (Decimal('2')*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / b
    k12 = (Decimal('2')*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / c
    k13 = (Decimal('2')*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / d
    k1s.append([a,k11,k12,k13])
  k2s = []

  for i in range(steps):
    a,b,c,d = kvgs[i]

    k21 = (Decimal('2')*a) / b
    k22 = (Decimal('2')*a) / c
    k23 = (Decimal('2')*a) / d

    k2s.append([a,k21,k22,k23])

  result = []
  default = x0 - h* x0
  for i in range(1, steps+1):
    a,b,c,d = k1s[i-1]
    ks,ls,ms,ns = k2s[i-1]
    if i == 1:
      result.append([x0])
      tep = b*x0 - default*ls
      result.append([tep])
    else:
      tep = k2s[i-3][1]*tep - result[i-2][0]*k1s[i-3][1]
      result.append([tep])
      
  return [data, kvgs, k1s, k2s, result]


if __name__ == "__main__":
  data = river_model_algorithm_solution(15, 0.16)

  for item in data:
    for key in item:
      print(list(map(str, key)))
    print()
