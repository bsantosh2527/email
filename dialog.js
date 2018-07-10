/**
 * Created by E066879 on 4/12/2017.
 */

import { Input, Output, EventEmitter, Component, ViewChild } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import template from './confirm.dialog.html';

@Component({
    selector: 'confirm-dialog',
    template
})

export class ConfirmDialog {

    @ViewChild('confirmDialog') cfd;

    @Input() message = '';
    @Input() context = '';
    @Input() title = '';

    @Output()
    onOkClick = new EventEmitter();
    @Output()
    onCancelClick = new EventEmitter();

    constructor() {
    }

    show = () => {
        this.cfd.show();
    };

    hide = () => {
        this.cfd.hide();
    };

    onOkClickHandler = (event$) => {
        this.onOkClick.emit(this.context);
    };

    onCancelClickHandler = (event$) => {
        this.onCancelClick.emit(this.context);
    };
}
