const fs = require("fs");



class Analysor {
    constructor(){ 
        console.log("created Analysor object");
    }
    Analysor (){
        console.log("hello");
    }
    check_permissoin(method, action, path){
        console.log(method, path);
        let permissions;
        try {
            
            const content = fs.readFileSync("./Policies.json", "utf8");
            permissions = JSON.parse(content); 
           
        } catch (error) {
            console.error("Error reading or parsing JSON:", error);
            return false;
        }
        const configData = JSON.parse(fs.readFileSync('./Config.json', 'utf8'));
        const patterns = configData.permissions.map(entry => entry.path);
        const matchedPattern = this.matchPath(path, patterns)
        console.log(matchedPattern)
        const property = this.findByProperty("path", matchedPattern, configData)
        console.log("here is the ",JSON.stringify(property))
        return false;
}

     matchPath(inputPath, patterns) {
        let matchingPatterns = [];

        for (let pattern of patterns) {
            
            let regexPattern = pattern.replace(/{owner}|{repo}|{id}|{pull_number}|{comment_id}|{reaction_id}|{issue_number}|{event_id}|{milestone_number}|{name}/g, '[^/]+');
            
          
            let regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(inputPath)) {
                matchingPatterns.push(pattern);
            }
        }

        return matchingPatterns;
    }

    findByProperty(property, value, configData){
        return configData.permissions.filter(entry => entry[property] == value);
    }
}

module.exports = Analysor;