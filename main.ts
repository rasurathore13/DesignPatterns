//Bridge with Factory

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

