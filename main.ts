//Bridge with Factory
// Use factory and bridge when u want to switch between multiple options in any system like - 
// If you want to switch between multiplt notifications in a notification system, 
// If you want to switch between multiple documents in a document creation system(CSV, Excel, etc),
// If you want to switch between multiple loggers (Console log, File log, etc)

interface INotification{
    sendNotification() : void;
}

class SmsNotification implements INotification{
    public sendNotification() : void {
        console.log('SMS Notification sent!!!')
    }
}

class EmailNotification implements INotification{
    public sendNotification() {
        console.log("EMAIL Notification sent!!!");
    }
}

class NotificationFactory {
    getNotificationObject(notificationType: string): INotification {
        if (notificationType == 'email') {
            return new EmailNotification();
        } else {
            return new SmsNotification();
        }
    }
}
class NotificationService {
    private notification: INotification;
    constructor(notification: INotification){
        this.notification = notification;
    }
    sendNotification() {
        this.notification.sendNotification();
    }
}

let notificatioFactory = new NotificationFactory();
let notification = notificatioFactory.getNotificationObject('sms');
let notificationService = new NotificationService(notification);
notificationService.sendNotification();



// Decoraters
// Use decorators if u want add extra functionality to controller endpoints like only let this 
// controller hit by an authenticated requests.
// Use decorators when u want to add extra functionality to DTOs, like only take this object if
// the name property of this object is more than 5 chracters.
//


interface IService{
    performSomeOperation(statement: string) : string;
}

class BasicService  implements IService{
    performSomeOperation(statement: string) :string {
        return 'This is logged usning basic operation -> ' + statement;
        
    }
}

class AdvanceService  implements IService{
    performSomeOperation(statement: string) :string {
        return 'This is logged usning advance operation -> ' + statement;
        
    }
}

class DecoratorService implements IService {
    private service: IService ;
    
    constructor(service: IService) {
        this.service=service;
    }

    performSomeOperation(statement: string): string {
        let data = this.service.performSomeOperation(statement);
        let regex = new RegExp('basic')
        if (regex.test(data)) {
            console.log('Basic operation identified, Converting to Advance operation');
            let newData = data.replace('basic','advance');
            console.log(data);
        } else {
            console.log(data);
        }
        return statement;
    }
}

let basicService = new BasicService();
let advanceService = new AdvanceService();

let basicDecoratorService = new DecoratorService(basicService);
let advanceDecoratorService = new DecoratorService(advanceService);

basicDecoratorService.performSomeOperation('Hi there');
advanceDecoratorService.performSomeOperation('Hi there');

// Chain of reponsibility
// Lets you handle request by a chain of handlers, one after the other
// Use it in middlewares, authentication of reuqets, error logging of requests

interface IHandler {
    handle(data:string): void ;
}

class FirstHandler implements IHandler{
    
    private nextHandler :IHandler | null;

    constructor(nextHandler: IHandler | null) {
        this.nextHandler = nextHandler;
    } 

    handle(data: string): void{
        console.log("Performing some action from 1st handler -> "+data)
        if(this.nextHandler == undefined || this.nextHandler == null) {
            return
        }
        this.nextHandler.handle(data);
    }
}

class SecondHandler implements IHandler{
    private nextHandler: IHandler | null;
    constructor(nextHandler: IHandler|null) {
        this.nextHandler = nextHandler;
    }
    handle(data: string): void{
        console.log("Handling from the 2nd handler"+data);
        if(this.nextHandler==null||this.nextHandler==undefined){
            return 
        }
        this.nextHandler.handle(data);
    }
}

class ThridHandler implements IHandler{
    private nextHandler : IHandler | null;

    constructor(nextHandler: IHandler | null) {
        this.nextHandler = nextHandler;
    }

    handle(data: string): void {
        console.log("Handling from 3rd handler  "+ data)
        if(this.nextHandler!=null || this.nextHandler!=undefined){
            this.nextHandler.handle(data);
        }
    }
}

let thridHandler = new ThridHandler(null)
let secondHandler = new SecondHandler(thridHandler)
let firstHandler = new FirstHandler(secondHandler);

firstHandler.handle("Test Data");


// Command patter
// Command is a behavioural design pattern that converts a request in to a standalone object 
// this standalong object has all the required values needed to execute the request

interface ICommand{
    execute():void;
};

class SimpleCommand implements ICommand{
    private payload: string;

    constructor(payload: string){
        this.payload = payload;
    }

    execute():void{
        if(this.payload){
            console.log('Doing something simple like printing the paylad->'+this.payload);
        }
    }
}

class ComplexCommand implements ICommand{
    private receiver: Receiver;
    private a : string;
    private b: string;
    constructor(receiver: Receiver,a:string,b:string){
        this.receiver = receiver;
        this.a = a;
        this.b = b;
    }
    execute(): void{
        this.receiver.doSomethingWithA(this.a);
        this.receiver.doSomethingWithB(this.b);
    }
}

class Receiver {
    

    doSomethingWithA(a:string): void{
        console.log("Doing something with a->"+a);
    }

    doSomethingWithB(b:string):  void{
        console.log("Doing something with b -> "+b)
    }

}

let receiver = new Receiver();
let complexCommand = new ComplexCommand(receiver,'this is a','this is b');
let simpleCommand = new SimpleCommand('this is a simple payload for simple command');
simpleCommand.execute();
complexCommand.execute();


//Mediator pattern 
//Mediator is behavioural design pattern that  decouples 2 component of an application by letting
// them talk to each other via a mediator object

interface IMediator{
    notify(data:string): void;
}

interface IComponent{
    setMediator(mediator: IMediator): void;
    doTask(data:string): void;
}

class ConcreteMediator implements IMediator{
    private component1: IComponent;
    private component2: IComponent;

    constructor(component1: IComponent, component2: IComponent){
        this.component1 = component1;
        this.component2 = component2;
    }

    notify(event: string){
        if(event == 'A'){
            this.component2.doTask('A');
        }
        if (event == 'D'){
            this.component1.doTask('B');
        }
    }
}

class Component1 implements IComponent{
    private mediator: IMediator;
    constructor(mediator?: IMediator){
        this.mediator = mediator!;
    }
    setMediator(mediator: IMediator):void{
        this.mediator = mediator;
    }
    doTask(data:string){
        console.log('DoTask triggered of Component 1 with data ->'+data);
    }
    doA(){
        console.log("Event A triggered from Component 1");
        this.mediator.notify('A');
    }
    doB(){
        console.log("Event B triggered from Component 1");
        this.mediator.notify('B');
    }
}

class Component2 implements IComponent{
    private mediator: IMediator;
    constructor(mediator?: IMediator){
        this.mediator = mediator!;
    }
    setMediator(mediator: IMediator):void{
        this.mediator = mediator;
    }
    doTask(data:string){
        console.log('DoTask triggered of Component 2 with data ->'+data);
    }
    doC(){
        console.log("Event C triggered from Component 2");
        this.mediator.notify('C');
    }
    doD(){
        console.log("Event D triggered from Component 2");
        this.mediator.notify('D');
    }
}


let comp1 = new Component1();
let comp2 = new Component2();
let mediator = new ConcreteMediator(comp1,comp2);
comp1.setMediator(mediator);
comp2.setMediator(mediator);
comp1.doA();
comp2.doD();


//Momento is a behavioural design pattern that lets you take snapshot of an object so that you can
// revert back to the older state of the object.

interface IMomento{
    getState():string;
}

class MomentoClass implements IMomento{
    
    private state: string;

    constructor(state: string){
        this.state = state;
    }

    getState(): string{
        return this.state;
    }
}

class OriginalObject{
    private state : string;
    private count = 0;
    constructor(state: string){
        this.state = state;
    }
    changeState():void{
        this.state = this.state+this.count;
        this.count += 1;
    }

    save(): IMomento{
        return new MomentoClass(this.state);
    }

    revert(momento: IMomento): void {
        this.state = momento.getState()
    }
    printCurrentState(){
        console.log(this.state);
    }
}


// class MomentoUser{
//     private momentos: IMomento[] ;
//     private originalObject : OriginalObject;
//     constructor(originalObject: OriginalObject){
//         this.originalObject = originalObject;
//         this.momentos = [];
//     }

//     changeState():void{
//         this.originalObject.changeState();
//     }

//     printCurrentState(){
//         console.log(this.originalObject.save().getState());
//     }

//     takeSnapShot(){
//         let currentState = this.originalObject.save()
//         this.momentos.push(currentState);    
//     }

//     goBack(){
//         let momento = this.momentos.pop();
//         if (momento != undefined || momento != null){
//             this.originalObject.revert(momento);
            
//         }else {
//             console.log("No snapshots present");
//         }
//     }
// }

let originalObject = new OriginalObject('initialString');
let momentos : IMomento[] = [];

momentos.push(originalObject.save());
originalObject.printCurrentState()

originalObject.changeState();
momentos.push(originalObject.save());
originalObject.printCurrentState()

originalObject.changeState();
momentos.push(originalObject.save());
originalObject.printCurrentState()

originalObject.revert(momentos.pop()!)
originalObject.printCurrentState();

originalObject.revert(momentos.pop()!)
originalObject.printCurrentState();

originalObject.revert(momentos.pop()!)
originalObject.printCurrentState();


// let momentoUser = new MomentoUser(originalObject);
// momentoUser.takeSnapShot();
// momentoUser.printCurrentState();

// momentoUser.changeState();
// momentoUser.takeSnapShot();
// momentoUser.printCurrentState();

// momentoUser.changeState();
// momentoUser.takeSnapShot();
// momentoUser.printCurrentState();

// momentoUser.goBack();
// momentoUser.printCurrentState();
// momentoUser.goBack();
// momentoUser.printCurrentState();
// momentoUser.goBack();
// momentoUser.printCurrentState();
// momentoUser.goBack();


// Observer is a behavioural design pattern that let's one object inform other objects about
// any change in the state of the object.

interface IObserver {
    observe(state: string): void;
}

class Observer implements IObserver{
    private observerNumber : number;
    private currentStateOfTheSubject : string = '';
    constructor(observerNumber: number){
        this.observerNumber = observerNumber;
    }
    observe(state: string): void{
        console.log(this.observerNumber + ' observer is informed of the state which is ->'+state);
        this.currentStateOfTheSubject = state;
    }
}

interface ISubject{
    attach(observer: IObserver):void;
    notify(state: string):void;
}

class SubjectClass implements ISubject{
    private observers: IObserver[] = [];
    private state: string;
    constructor(state: string){
        this.state = state;
    }
    attach(observer: IObserver):void{
        this.observers.push(observer);
    }
    
    notify(): void{
        this.observers.forEach(x => {
            x.observe(this.state);
        })
    }
    modifyState(){
        this.state = this.state+Math.random().toString();
        this.notify();
    }
}

let subject = new SubjectClass('Start');
let observer1 = new Observer(1); 
let observer2 = new Observer(2);
let observer3 = new Observer(3);
subject.attach(observer1);
subject.attach(observer2);
subject.attach(observer3);

subject.modifyState();
subject.modifyState();


// State design pattern is a behavioural design pattern that changes the behaviour of an object
// whenever there is a change in the internal state of the object.
interface IState{
    handleRequest(): void;
}

class StateA implements IState{

    public handleRequest(): void {
        console.log("Handling request from State A")
    }
}

class StateB implements IState{
    public handleRequest(): void{
        console.log("Handling request from State B")
    }
}


class Context{
    private state: IState;
    constructor(initialState: IState){
        this.state = initialState;
    }

    public changeState(state: IState): void{
        this.state = state;
    }

    public request(): void{
        this.state.handleRequest();
    }
}

let context = new Context(new StateA);
context.request(); // prints - "Handling request from State A
context.changeState(new StateB);
context.request(); // prints - Handling request from State B
