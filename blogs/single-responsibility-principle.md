# Clean Code Concepts: Be SOLID: Single Responsibility Principle

**Published:** April 6, 2019

Writing clean code is more of an art rather than a science. So What really makes code **cleaner**?. In this series called Clean Code Concepts, we investigate some of the ways to write code in a clean way.

There are several aspects to write cleaner code, some are language agnostic others are language dependent.

In this series, we would focus on some of the language-agnostic parts which can be used to improve your ability to write cleaner code in any language.

So let's dive right into it.

**S.O.L.I.D** is an acronym for the **first five object-oriented design**(**OOD**) principles by Robert C. Martin. It stands for:

- **S** - Single-responsibility principle
- **O** - Open-closed principle
- **L** - Liskov substitution principle
- **I** - Interface segregation principle
- **D** - Dependency Inversion Principle

In this blog post, we would focus exclusively on Single-responsibility principle along with examples in Java and python.

### What is it?
Single Responsibility Principle states that

"A class should have one and only one reason to change."

The question here is what begets change in software applications. It will be most probably due to the addition of new features(unless you are refactoring legacy code).

### How to think of SRP
The best way to think about it is to think of each class as an API or a microservice(Let's call it a nano-service :p ).  What does this class(or API) is intended to do?

If we have to make modifications to a class/service, for different reasons, it means the abstraction is incorrect, and that the class has too many responsibilities.

We want to **avoid creating classes that try to "Do it All".**

SRP can be applied to a variety of contexts. You can apply it to methods(or functions), classes and even modules(or packages).

I would even argue the **modern microservice architecture is just SRP at the application level.**

#### Refactoring Code to SRP
If you need to refactor some code and you want to check for SRP, you try to see if we can find methods that are mutually exclusive. In that case, we may want them to be part of separate classes.

In other words, if we have 2 reasons to change for a class, we have to split the functionality into two classes.

#### Implementation
Suppose we need to create an Employee Management Software for an application. Below are the requirements

- Save and remove employees
- Print employee reports in XML and CSV

Let's say we create a class with a UML like this:

** Employee**

-  id: long
- name: String
- dept: String
- working: Boolean

-  saveEmployee()
- removeEmployee()
- printXMLReport()
- printCSVReport()

#### What is wrong with this approach

- The class is trying to do too much. It is saving to DB , preparing reports. Let’s say, nurses, doctors, etc inherit from the employee class. Now it will become a nightmare for programmers if every different employee object wants to handle the class in their own way. A single indentation change would require us to make code changes in a lot of places.

- Secondly, all the operations seem to be an operation that should be performed on an employee rather than the employee should perform these operations. Therefore these methods do not belong to employee class.

- What if the database implementation changes. Now we need to modify the code in the employee class and all classes that inherit it. Database interaction should be done by a separate class

- If the format of XML or CSV changes?. That would again lead to the same problem where an indentation change might lead to change in lots of places.
- Also, see **do you see two mutually exclusive features here. **The report formatting part of employee and data class of employee.

Let's try to implement classes which follow SRP. Suppose we have

#### Few things to note here are

- The employee class is a POJO(plain old java object) or a data class.
- The EmployeeDAO(DAO stands for Data Access Object) is responsible for all operations for operations (saving and deleting employees) on employees to the database. The DAO class has a dependency relationship with the employee class. Also, The DAO class has an aggregation association relation with the DatabaseConnectionManager. DAO object “has a” connection manager object. Both the connection manager and DAO object have their own object lifetimes.
- The EmployeeReportFormatter class has an aggregation dependency on the employee class. EmployeeReportFormatter has an Employee object.

The solid arrow represents inheritance. So Reportformater is the parent class where we implement all the formatting. The EmployeeReportFormatter simply inherits the ReportFormatter and all methods from it.

Here is the implementation in Java.

Here is a similar implementation in Python3.

**Warning:**

Even good stuff can be overdone and so is true for SRP.

A Senior engineer I used to with, wanted to create a REST API for a single function(literally a single method in python), his rationale behind it was, he was trying to create a microservice.

Of course, he wasn't realizing he was creating a highly **frAGILE** code.

If you find yourself writing one method in each class(and have a lot of classes) or having one file in a module(or package) with a lot of packages, chances are you are creating a highly fragmented code.

I hope you liked the blog post. Please do share it with your friends, coworkers if you liked it.

Also please let me know in the comments did you enjoy reading it. Your feedback will help us tailor the content and bring content that you like sooner.