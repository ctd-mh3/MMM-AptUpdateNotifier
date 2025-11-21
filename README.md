# MMM-AptUpdateNotifier

This a module for <strong>MagicMirror²</strong><br>
https://magicmirror.builders/<br>


This module uses https://github.com/dathbe/MMM-CustomText to provide a message on the MagicMirror if there are apt package updates available to be installed.  

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/ctd-mh3/MMM-AptUpdateNotifier
git clone https://github.com/dathbe/MMM-CustomText'
sudo mv ./MMM-AptUpdateNotifier/check_for_apt_updates.sh /usr/local/bin/.'
```
Ensure /usr/local/bin/check_for_apt_updates.sh is executable by the user MagicMirror is run under
-Allow check_for_apt_updates.sh to be run without sudo your MagicMirror user by editing sudoers
  <br>'sudo vidudo'
  <br>Add "pi ALL=(root) NOPASSWD: /usr/local/bin/check_for_apt_updates.sh" where 'pi' is replaced with the linux user which MagicMirror is running under




### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
    
    	{
  			module: "MMM-CustomText",
 	 		// Place where you want this message
 	 		position: "top_bar",  
  			config: {
			    // Must ensure this uniqueID matches default ("aptUpdateNotifier") in MMM-AptUpdateNotifier or value passed in MMM-AptUpdateNotifier config
    			uniqueID: "aptUpdateNotifier", 
  			}
		},
        ...
		{
  			module: "MMM-AptUpdateNotifier",
  			position: "bottom_bar", // module's own UI is minimal; position isn't important
		},
        ...
    ]
}
```

### Configuration options

The following properties can be configured:

| Option                | Description
|-----------------------|------------
|`command`	|*Optional* The shell script including full path which will output the number of packages which have an update available.<br><br>**Type:** `string`<br>**Default:** `"/usr/local/bin/check_for_apt_updates.sh"`
|`useSudo`		|*Optional* Is sudo needed to run the above cmd as MagicMirror user<br><br>**Type:** boolean<br>**Default:** `true`
|`timeoutMS`	|*Optional* Timeout (in milliseconds) used when attempting to run the above command<br><br>**Type:** `int`<br>**Default:** `30000` (30 seconds)
|`checkIntervalMS`	|*Optional* Interval (in milliseconds) for how often to run the above command to check for apt updates<br><br>**Type:** `int`<br>**Default:** `3600000` (1 hr)
|`customTextUniqueID`	|*Optional* uniqueID for MMM-CustomText field to place results-<br><br>**Type:** `string<br>**Default:** `"aptUpdateNotifier""`


### Sample Configuration

Below is bare minimum example relevant parts of a `config/config.js` file:
```
		{
  			module: "MMM-CustomText",
 	 		// Place where you want this message
 	 		position: "top_bar",
  			config: {
			    // Required uniqueID for MMM-AptUpdateNotifier
    			uniqueID: "aptUpdateNotifier", 
  			}
		},
		
		...
		
		{
  			module: "MMM-AptUpdateNotifier",
  			position: "bottom_bar", 
'''

Below is example with more optional configuration options used in `config/config.js` file:
```
		{
  			module: "MMM-CustomText",
 	 		// Place where you want this message
 	 		position: "top_bar",
  			config: {
			    // Required uniqueID for MMM-AptUpdateNotifier
    			uniqueID: "aptInfo", 
				// Set to blank string
				initialMessage: "Waiting for apt package information"
  			}
		},
		
		...
		
		{
  			module: "MMM-AptUpdateNotifier",
  			position: "bottom_bar", 
 	 		config: {
   				checkIntervalMS: 30 * 60 * 1000, // every 30 minutes
   				customTextUniqueID: "aptInfo", // Must match uniqueID used in MMM-CustomText config
			}
		},
'''


## Future Potential Updates

1. TBD

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/ctd-mh3/MMM-AptUpdateNotifier/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.