# Clean Code Concepts: Be SOLID: Open Closed Principle

**Published:** May 11, 2019

In this series, we would focus on some of the language-agnostic parts which can be used to improve your ability to write cleaner code in any language.

So let’s dive right into the SOLID concepts of object-oriented design.

**S.O.L.I.D** is an acronym for the **first five object-oriented design**(**OOD**) principles by Robert C. Martin. It stands for:

- **S** – Single-responsibility principle- **O** – Open-closed principle- **L** – Liskov substitution principle- **I** – Interface segregation principle- **D** – Dependency Inversion Principle

In this blog post, we would focus exclusively on the Open-Closed principle along with examples in Java and python.

Open Closed principle states that we should design classes such that they should be **open to extension but closed for modification.**

Open closed principle(taken from https://medium.com/@trekhleb/solid-principles-around-you-6db2f0e12139)

What this means is that. When something new appears on the domain problem, we only want to add new things to our model.

We do not change anything existing since it is closed for modification.

*If for some reason, when something new has to be added, we found ourselves modifying the code, then that logic is probably poorly designed.*

#### That's okay but how does it relate to code I write?

Another way to think about it, When we write our classes, our member functions should be self-contained and closed for modification.

We can apply the open-closed principle to a lot of different scenarios. Having said that, it is mostly used in the context of class design. It states.

**We should design our classes such that we should not modify them to add new functionality but in such a way they could be extended.**

Defining OCP in the context of methods within a class entails existing methods should ideally not be modified to accommodate changes to new methods.

We can apply the same concept to a module level as well.

 When we design our modules, they should be self-contained. They should be designed in such a way that we can add new modules, without modifying existing ones.

Ideally, when requirements change, we want to just have to extend the module with the new required behavior in order to comply with the new requirements, but without having to modify the code.

In this example, we are designing a home entertainment situation.

#### **Let's see first how a bad design would look like**

We would create three classes TV, SurroundSoundSystem and Projector class all implementing their own methods.

A client class called RemoteControl class would ideally call these devices and ask them to turn on or off.

A bad way would look something like this.

class RemoteControlBad:
  __remote = None
  def __init__(self):
    if not RemoteControl.__remote:
        print(" Constructor called..")
    else:
        print("Instance already exists:", self.getInstance())
        
  @classmethod
  def getInstance(cls):
    if not cls.__instance:
        cls.__instance = RemoteControl()
    return cls.__remote
  
  def turn_on_tv(self):
    pass
  def turn_off_tv(self):
    pass
  def turn_on_projector(self):
    pass
  def turn_off_projector(self):
    pass

**Why is this design bad?**

Every time we want to add a new device lets say a Surround Sound System we have to modify the class and its methods.

**So how would we design it better?**

We would have a Device interface or an abstract base class. This interface would be implemented by the TV, SurroundSoundSystem and Projector class.

The Device interface would have two methods turnOn() and turnOff(). All classes that would implement this interface would have to implement them as well.

RemoteControl class is a singleton. It has a member variable called device.

So now we can keep adding as many devices and remote control can connect to all of them.

We don't need to modify the Remote Control Class however any new device can extend the Device class.

Hence it is open for extension and closed for modification.

Here is an implementation in python.

In summary, This principle tackles an important problem in software engineering: **maintainability. **Often times the metric we use for deciding if a code is** maintainable **is there are ripple effects of a single change breaking the entire code base.

The perils of not following the OCP are ripple effects and problems in the software where a single change triggers changes all over the code base, or risks breaking other parts of the code.