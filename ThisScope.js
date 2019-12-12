var  person1 = {
    name: "pranav",
    print1 : () => {
        console.log("name " + this.name + " age: ", this.age)
    }
 }

 var Person2 = {
     name: "Rahul",
     age: "27"
 }

 var printtest = person1.print1.bind(Person2)

 printtest()