export class WebError extends Error {
    private _additionalInfo: { status: number };

    constructor (message?: string, additionalInfo?: { status: number }) {
        super(message);
        this._additionalInfo = additionalInfo ?? { status: 500 };
    }

    get additionalInfo() {
        return this._additionalInfo;
    }
}