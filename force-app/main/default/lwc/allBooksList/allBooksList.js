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
            this.receivedMessage = {
                title: message.lmsData.title.value || '',
                author: message.lmsData.author.value || '',
                status: message.lmsData.status.value || ''
            };
        }
        }
    }
   

    // disconnectedCallback() {
    //     window.removeEventListener('submit', this.handleFormSubmit);
    // }
