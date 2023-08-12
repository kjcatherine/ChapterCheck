import { LightningElement, wire} from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { APPLICATION_SCOPE, MessageContext, subscribe} from 'lightning/messageService'

export default class AllBooksList extends LightningElement {
    receivedMessage = {
        title: '',
        author: '',
        status: ''
    };
    subscription

    @wire(MessageContext)
    context

    connectedCallback() {
        this.handleFormSubmit()
    }

    handleFormSubmit() {
        this.subscription = subscribe(this.context, BOOKCHANNEL, (message)=>{this.handleFormMessage(message)}, {scope:APPLICATION_SCOPE})
        // book.id = Date.now(); // Using Date.now() to create a unique identifier
        // this.bookList = [...this.bookList, book];
    }

    handleFormMessage(message){
        if (message) {
            // Update the receivedMessage object with the received data
            this.receivedMessage = {
                title: message.title.value,
                author: message.author.value,
                status: message.status.value
            };
        }
        //this.receivedMessage = message.title.value ? message.title.value : "No title"
        // message.author.value ? message.author.value : "No author",
        // message.status.value ? message.status.value : "No status"
    }
    }
   

    // disconnectedCallback() {
    //     window.removeEventListener('submit', this.handleFormSubmit);
    // }
