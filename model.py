import random
import math

# 2*h[n-1] + h[n-1]*(h[n-1] + h[n])*V_star - h[n-1]*h[n]*(h[n-1] + h[n])*Gi[n]
# h[n-1]*(2 + V_star*(h[n-1] + h[n]) - h[n]*(h[n-1] + h[n]))

# def generate_some_params():
#   diffusion = random.uniform(0, 1)
#   speed_of_river = random.uniform(2, 80)
#   volume = random.uniform(2,8)
#   return [diffusion, speed_of_river, volume]

def init_args(steps):
  sigma = 0.1
  v = 1.1
  h = 1
  niu = v**2
  x0 = 0.16
  
  V = 1 - (niu / v)
  D = sigma / (v**2)

  V_star = V / D

  k1, k2, k3 = [0.26, 0.09, 0.01]
  data = []
  for i in range(1, steps+1):
    hs = (h*i)**.5
    g1 = -k1
    g2 = -k2 * (1 - math.exp(-k1*hs))
    g3 = -k3 * (1 - math.exp(-k2*hs*(1- math.exp(-k1*hs))))
    data.append([hs, g1/D,g2/D,g3/D])
  kvgs = []

  for i in range(1, steps + 1):
    a,b,c,d = data[i-1]
    if i != 1:
      kvg1 = 2*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*b
      kvg2 = 2*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*c
      kvg3 = 2*data[i-2][0] + data[i-2][0]*(a + data[i-2][0])*V_star - a*data[i-2][0]*(a + data[i-2][0])*d
    else:
      kvg1 = 2*h + h*(a + h)*V_star - a*h*(a + h)*b
      kvg2 = 2*h + h*(a + h)*V_star - a*h*(a + h)*c
      kvg3 = 2*h + h*(a + h)*V_star - a*h*(a + h)*d
      

    kvgs.append([a, kvg1, kvg2, kvg3])

  k1s = []

  for i in range(1, steps+1):
    a,b,c,d = kvgs[i-1]
    k11 = (2*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / b
    k12 = (2*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / c
    k13 = (2*data[i-2][0] + data[i-2][0]*(data[i-2][0] + a)*V_star + 2*a) / d
    k1s.append([a,k11,k12,k13])
  k2s = []

  for i in range(steps):
    a,b,c,d = kvgs[i]

    k21 = (2*a) / b
    k22 = (2*a) / c
    k23 = (2*a) / d

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
  data = init_args(15)

  for item in data:
    for key in item:
      print(key)
    print()
    
    
    
    
    
  
  
  
  
  