import { LightningElement, wire } from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { MessageContext, publish} from 'lightning/messageService';
export default class AddBooks extends LightningElement {
    @wire(MessageContext)
    context

    title = '';
    author = '';
    status = 'Not Read';

    statusOptions = [
        { label: 'Read', value: 'Read' },
        { label: 'Not Read', value: 'Not Read' }
    ];

    handleTitleChange(event) {
        this.title = event.target.value;
    }

    handleAuthorChange(event) {
        this.author = event.target.value;
    }

    handleStatusChange(event) {
        this.status = event.detail.value;
    }

    handleSubmit() {
        handleSubmit() {
            const message = {
                title: this.title,
                author: this.author,
                status: this.status
            };
        // const message={
        //     title:{
        //         value:this.title
        //     },
        //     author:{
        //         value:this.author
        //     },
        //     status:{
        //         value:this.status
        //     }
        // }
        publish(this.context, BOOKCHANNEL, {message})
        this.resetFormFields();
    }

    resetFormFields() {
        this.title = '';
        this.author = '';
        this.status = 'Not Read';
    }
}
}
