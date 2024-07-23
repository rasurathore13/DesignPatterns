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
