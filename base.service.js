import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class BaseService {
	constructor (http: Http, toastr: ToastsManager, cookieService: CookieService) {
		this.http = http;
		this.toastr = toastr;
		this.cookieService = cookieService;
	}

	httpGet (url, headers) {
		return this.http.get (url, headers);
	}

	httpPost (url, body, headers) {
		return this.http.post (url, body, headers);
	}

	doGet (url, datahandler: Function, errorhandler: Function = null, optHeaders: Headers = null) {
		var headers = new Headers(),
			me = this;

		me.errorhandler = errorhandler;
		me.datahandler = datahandler;
		me.createAuthorizationHeader (headers, optHeaders);
		return me.httpGet (url, {
			headers
		}).map (response => this.validateResponse(response, datahandler))
		.catch (error => me.handleError(error));
	}

	doPost (url, body, datahandler: Function, errorhandler: Function = null, optHeaders: Headers = null) {
		var headers = new Headers(),
			me = this;

		me.errorhandler = errorhandler;
		me.datahandler = datahandler;
		me.createAuthorizationHeader (headers, optHeaders);
		return me.httpPost (url, body, {
			headers
		}).map (response => this.validateResponse(response, datahandler))
		.catch (error => me.handleError(error));
	}

	createAuthorizationHeader (headers, optHeaders) {
		if (optHeaders && 'function' === typeof optHeaders.keys) {
			optHeaders.keys().forEach (k => {
				switch (k.toLowerCase()) {
					case 'userid':
					case 'mccmock':
					case 'content-type':
						break;
					default:
						headers.append (k, optHeaders.get(k));
				}
			});
		}
		headers.append ('mccMock', 'Y');
		headers.append ('userid', sessionStorage.getItem('userId'));
		headers.append ('content-type', 'application/json');
		headers.append ('X-XSRF-Token', this.cookieService.get('XSRF-TOKEN'));
		headers.append ('X-Product-ID', sessionStorage.getItem('productId'));
		headers.append ('X-SS-USER', this.cookieService.get('x-ss-user'));
	}


	validateResponse (res, handler) {
      	const responseContent = res && res._body ? res._body : '';

		if (responseContent && responseContent.indexOf('/pkmslogin') !== -1) {
			location.reload();
		} else {
			return handler(res);
		}
	}

	handleError (error) {
		var errMsg = error.statusText || error.status ? `${ error.status } - ${ error.statusText }` : 'Server error';

		if (412 === error.status) {
			const body = JSON.parse(error._body);

			errMsg = body.errorMessage ? `${ body.errorCode } - ${ body.errorMessage }` : errMsg;
		}
		if ('function' === typeof this.errorhandler) {
			this.errorhandler(errMsg);
		}
		if (errMsg === 'Server error' ) {
			//location.reload();
		} else {
			this.showErrorMessage(this.getErrorMessage (error.status, errMsg));
		}
		//this.showErrorMessage(this.getErrorMessage (error.status, errMsg));
		return Observable.throw (errMsg);
	}

	showErrorMessage (message) {
		this.toastr.error (message, 'Error');
	}

	getErrorMessage (code, errMsg) {
		let errorText = '';

		switch (code) {
			case -1:
				errorText = 'No status information available';
				break;
			case 0: // No conx
				errorText = 'No internet connection available';
				break;
			case 401: // Unauthorized
				errorText = 'Unauthorized web service invocation.  Is user logged in?';
				break;
			case 403: // Forbidden
				errorText = 'Forbidden web service invocation.  Is authenticated user authorized to access resource?';
				break;
			case 404: // URL not found
				errorText = 'Web service url not found';
				break;
			case 504:
				errorText = 'Gateway time out occurred';
				break;
			default:
				errorText = errMsg;
		}
		return errorText;
	}

	isoDateToParmFormat (date) {
		const arr = date.split ('-');

		return `${ arr[1] }${ arr[2] }${ arr[0] }`;
	}

	stringifyDate (date) {
		const day = date.getDate(),
			month = date.getMonth() + 1,
			year = date.getFullYear(),
			dayString = day < 10 ? `0${ day }` : day.toString(),
			monthString = month < 10 ? `0${ month }` : month.toString(),
			returnDate = monthString + dayString + year;

		return returnDate;
	}

}
