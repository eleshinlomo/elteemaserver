import { storeNotificationOrderCancelledByAdmin } from "../../htmpages/admin/orderCancelledByAdmin.js"
import { Orders } from "../../models/order.js"
import { Stores } from "../../models/storeData.js"
import { Users } from "../../models/userData.js"



export const deleteOrder = async (payload) => {
  const { selectedOrderId, reason } = payload;

  // Find the order
  const order = await Orders.findById(selectedOrderId);
  if (!order) {
    return { ok: false, error: `No order with id: ${selectedOrderId} found` };
  }

  // Delete order from Orders collection
  await Orders.deleteOne({ _id: selectedOrderId });

  // Remove order from all stores' currentOrders arrays
  const stores = await Stores.find({ "orders.currentOrders._id": selectedOrderId });
  for (const store of stores) {
    store.orders.currentOrders = store.orders.currentOrders.filter(
      (order) => order._id.toString() !== selectedId
    );
    await store.save();
  }

  // Remove order from all users' orders
  const users = await Users.find({ "orders._id": selectedOrderId });
  for (const user of users) {
    user.orders = user.orders.filter(
      (order) => order._id.toString() !== selectedOrderId
    );
    await user.save();
  }

  // Notify cancellation
  await storeNotificationOrderCancelledByAdmin(order, reason);

  return { ok: true, message: 'Order has been deleted successfully' };
};
