import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import {
    PagedItemPresenter,
    PagedItemView,
} from "../../presenters/PagedItemPresenter";

export const PAGE_SIZE = 10;

interface Props<ItemType, ServiceType> {
    presenterGenerator: (
        view: PagedItemView<ItemType>
    ) => PagedItemPresenter<ItemType, ServiceType>;
    componenetGenerator: (item: ItemType) => JSX.Element;
}

// item type, presenter in presenter generator, service is U

const ItemScroller = <ItemType, ServiceType>(props: Props<ItemType, ServiceType>) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<ItemType[]>([]);
    const [newItems, setNewItems] = useState<ItemType[]>([]);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

    const { displayedUser, authToken } = useUserInfo();

    // Initialize the component whenever the displayed user changes
    useEffect(() => {
        reset();
    }, [displayedUser]);

    // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
    useEffect(() => {
        if (changedDisplayedUser) {
            loadMoreItems();
        }
    }, [changedDisplayedUser]);

    // Add new items whenever there are new items to add
    useEffect(() => {
        if (newItems) {
            setItems([...items, ...newItems]);
        }
    }, [newItems]);

    const reset = async () => {
        setItems([]);
        setNewItems([]);
        presenter.reset();
        setChangedDisplayedUser(true);
    };

    const listener: PagedItemView<ItemType> = {
        addItems: (newItems: ItemType[]) => setNewItems(newItems),
        displayErrorMessage: displayErrorMessage,
    };

    const [presenter] = useState(props.presenterGenerator(listener));

    const loadMoreItems = async () => {
        presenter.loadMoreItems(authToken!, displayedUser!.alias);
        setChangedDisplayedUser(false);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={presenter.hasMoreItems}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="row mb-3 mx-0 px-0 border rounded bg-white"
                    >
                        {props.componenetGenerator(item)}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default ItemScroller;
