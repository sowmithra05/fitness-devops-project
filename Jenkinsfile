pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sowmithra05/fitness-devops-project.git'
            }
        }

        stage('Check Files') {
            steps {
                sh 'ls'
            }
        }

        stage('Build Success') {
            steps {
                echo 'Pipeline executed successfully ✅'
            }
        }
    }
}