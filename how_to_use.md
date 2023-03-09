<h1> RiverModel </h1>

<h2>
Description
</h2>
<p>
That package helps solving water quality grade problem using specified in model.docx file on that repository
algorithm
</p>

<h2>
Prerequisites
</h2>
<p>
First you should have installed Python 3.8 or more later version
</p>


<h2>
Installation
</h2>
<ol>
<li>
    Download file <code>rivermodel-0.1.tar.gz</code> from this repository
</li>
<li>
    Unpack it on empty directory, already created by using <code>mkdir somedir</code>
</li>
<li>
    Move on that directory and execute following command:
</li>
    <code>python setup.py install</code> or <code> pip install . </code>
</ol>

<h2>
How to use
</h2>

<p>
Here is example that demonstrates work of that package:
<br>

```Python
from rivermodel import RiverModel
data = 0.16
steps = 5
print(RiverModel.solve(data, steps))

```

<code>
>>> ['0.16', '-0.3566850996320474294470948318', 
    '0.000988178890538532171928158118', '-0.7948150536804221905624306635', '-0.2291222049523051399098763179']
</code>

rivermodel package has only one function-wrapper <code>solve(initial_data, steps_to_predict)</code>
<ul>
<li>
<code>
initial_data
</code>
- argument of type float, cam be big or small


</li>
<li>
<code>
steps_to_predict
</code>
- argument of type int, allows to return count of predictions from inital value of data
</li>
</ul>

