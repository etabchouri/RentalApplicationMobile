function inventoryItemsLocateViewModel() {
    var self = this;

    self.item = ko.observable('');
    self.summary = ko.observable('');
    self.results = ko.observableArray([]);
    self.keyUp = function (data, e) {
        if (e.keyCode == 13) {
            self.locate();
        }
    };
    self.locate = function () {
        self.results([]);

        if (self.item()) {

            self.summary('Locating \"' + self.item() + '\"');

            var url = 'https://remote.corpservice.com:8143/RentalServices/Data/Entities/Service.svc/InventoryItemLocationSummaries?CS-UserName=TIMLAJ&CS-Password=TIMLAJ&CS-Database=TQ_DEMO&$format=json&$filter=ItemCode eq \'' + self.item() + '\'&$select=LocationCode,TotalInventory,TotalOut,TotalOnHand';

            $.ajax({
                url: url,
                jsonp: '$callback',
                dataType: 'jsonp'
            })
            .fail(
            function (jqXHR, textStatus) {
                self.summary(textStatus);

            })
            .done(
            function (data, textStatus, jqXHR) {
                self.summary(data.d.length + ' locations contain \"' + self.item() + '\"');

                for (var i in data.d) {
                    self.results.push(data.d[i]);
                }
            });
        }
        else
            self.summary('Enter an item.');
    };
}