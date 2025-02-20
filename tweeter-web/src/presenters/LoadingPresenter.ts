import { Presenter, View} from "./Presenter";

export interface LoadingView extends View {
    setIsLoading: (value: boolean) => void;
}

export class LoadingPresenter<LV extends LoadingView> extends Presenter<LV> {

    public constructor(view: LV) {
        super(view);
    }

    public doFailureReportWithFinally(operation: () => Promise<void>, operationDescription: string, operationFinally: () => void) {
        this.doFailureReportingOperation(operation, operationDescription).finally(() => {
            operationFinally();
            this.view.setIsLoading(false);
        });
    }
}