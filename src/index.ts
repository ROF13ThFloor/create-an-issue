import { Toolkit } from "actions-toolkit";
import { createAnIssue } from "./action";
import {createPullRequest} from "./action"

Toolkit.run(createAnIssue, {
  secrets: ["GITHUB_TOKEN"],
});

Toolkit.run(createPullRequest, {
  secrets: ["GITHUB_TOKEN"],
});