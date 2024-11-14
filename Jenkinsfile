pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS' // Ensure this matches your NodeJS tool in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        SONARQUBE_SERVER = 'SonarQube'   // Ensure this matches your SonarQube server name in Jenkins
        GITHUB_CREDENTIALS_ID = 'github-pat' // GitHub credentials ID
        NEXUS_URL = 'http://localhost:8081' // Nexus URL
        NEXUS_REPO = 'node-app-repo'  // Replace with your Nexus repository name
        NEXUS_CREDENTIALS_ID = 'nexus-credentials' // Nexus credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: "${GITHUB_CREDENTIALS_ID}", url: 'https://github.com/scarlet2131/NodeAppCICD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // Replace with your build command if different
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // Replace with your test command if different
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') { // Ensure this matches your SonarQube server name
                    sh 'sonar-scanner -Dsonar.projectKey=my-nodejs-project'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Package Artifact') {
            steps {
                sh 'zip -r node-app.zip dist/' // Replace dist/ with your build output directory
            }
        }

        stage('Deploy to Nexus') {
            steps {
                nexusArtifactUploader artifacts: [
                    [artifactId: 'node-app', classifier: '', file: 'node-app.zip', type: 'zip']
                ],
                credentialsId: "${NEXUS_CREDENTIALS_ID}",
                groupId: 'com.example',
                nexusUrl: "${NEXUS_URL}",
                repository: "${NEXUS_REPO}",
                version: '1.0.0'
            }
        }

        stage('Deploy Application') {
            steps {
                sh 'pm2 stop node-app || true' // Stop the old app
                sh 'pm2 start app.js --name node-app --watch' // Start the new app
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
