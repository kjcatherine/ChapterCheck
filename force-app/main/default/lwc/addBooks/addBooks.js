import { LightningElement, api, wire } from 'lwc';
import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
import { MessageContext, APPLICATION_SCOPE, publish, subscribe} from 'lightning/messageService';

export default class AddBooks extends LightningElement {
    @api selectedRowData;
    @api isEditing;
    subscription

    title = '';
    author = '';
    status = 'Not Read';

    @wire(MessageContext)
    context

    statusOptions = [
        { label: 'Read', value: 'Read' },
        { label: 'Not Read', value: 'Not Read' }
    ];

    get formTitle() {
        return this.isEditing ? 'Edit Book' : 'Add a Book';
    }

    get saveButtonLabel() {
        return this.isEditing ? 'Save' : 'Submit';
    }

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
        const message={
            lmsData:{
                title: { value: this.title },
                author: { value: this.author },
                status: { value: this.status }
            }
        }
        publish(this.context, BOOKCHANNEL, message)
        this.resetFormFields();
    }

    resetFormFields() {
        this.title = '';
        this.author = '';
        this.status = 'Not Read';
    }

    connectedCallback() {
        // Subscribe to the message channel to receive selected row data
        this.subscription = subscribe(this.context, BOOKCHANNEL, (message) => {
            if (message && message.lmsData) {
                this.title = message.lmsData.title.value;
                this.author = message.lmsData.author.value;
                this.status = message.lmsData.status.value;
            }
        }, { scope: APPLICATION_SCOPE });
    }
}


// import { LightningElement, wire, track, api } from 'lwc';
// import BOOKCHANNEL from '@salesforce/messageChannel/BooksChannel__c'
// import { MessageContext, publish} from 'lightning/messageService';
// export default class AddBooks extends LightningElement {
//     @api selectedRowId;
//     @api selectedRowData;
//     @api isEditing;

//     @track title = '';
//     @track author = '';
//     @track status = 'Not Read';

//     @wire(MessageContext)
//     context

//     statusOptions = [
//         { label: 'Read', value: 'Read' },
//         { label: 'Not Read', value: 'Not Read' }
//     ];

//     get formTitle() {
//         return this.isEditing ? 'Edit Book' : 'Add a Book';
//     }

//     get saveButtonLabel() {
//         return this.isEditing ? 'Save' : 'Submit';
//     }

//     handleTitleChange(event) {
//         this.title = event.target.value;
//     }

//     handleAuthorChange(event) {
//         this.author = event.target.value;
//     }

//     handleStatusChange(event) {
//         this.status = event.detail.value;
//     }
    
//     handleSubmit() {
//         const message={
//             lmsData:{
//                 title: { value: this.title },
//                 author: { value: this.author },
//                 status: { value: this.status }
//             }
//         }
//         publish(this.context, BOOKCHANNEL, message)
//         this.resetFormFields();
//     }

//     resetFormFields() {
//         this.title = '';
//         this.author = '';
//         this.status = 'Not Read';
//     }

//     connectedCallback() {
//         if (this.isEditing) {
//             // Populate the form fields with data from selectedRowData
//             this.title = this.selectedRowData.title;
//             this.author = this.selectedRowData.author;
//             this.status = this.selectedRowData.status;
//         }
//     }
// }
