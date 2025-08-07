import { storeNotificationOrderCancelledByAdmin } from "../../htmpages/admin/orderCancelledByAdmin.js"
import { Orders } from "../../models/order.js"
import { Stores } from "../../models/storeData.js"
import { Users } from "../../models/userData.js"



export const deleteOrder = async (payload) => {
  const { selectedOrderId, reason } = payload;

  // Remove order from all users
  const users = await Users.find({ "orders._id": selectedOrderId });
  for (const user of users) {
    user.orders = user.orders.filter(
      (order) => order._id.toString() !== selectedOrderId
    );
    user.markModified('orders');
    await user.save();
  }

  // Remove order from all stores
  const stores = await Stores.find({ "orders.currentOrders._id": selectedOrderId });
  for (const store of stores) {
    store.orders.currentOrders = store.orders.currentOrders.filter(
      (order) => order._id.toString() !== selectedOrderId
    );
    store.markModified('orders.currentOrders');
    await store.save();
  }

  // Find and delete the order from Orders collection
  const orderInOrders = await Orders.findById(selectedOrderId);
  if (orderInOrders) {
    await Orders.deleteOne({ _id: selectedOrderId });
  }

  // Notify user (optional)
  if (orderInOrders?.buyerId) {
    const buyer = await Users.findById(orderInOrders.buyerId);
    if (buyer?.email) {
      await storeNotificationOrderCancelledByAdmin(
        buyer.email,
        orderInOrders,
        reason
      );
    }
  }

  return { ok: true, message: 'Order has been deleted successfully' };
};

